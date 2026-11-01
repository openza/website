// Astro integration that writes _headers with a strict Content-Security-Policy after each build.
// Inline scripts and style attributes emitted by Starlight are allowed by hash only,
// so nothing third-party and nothing unlisted can run.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cloudflare limits _headers lines to 2,000 characters.
const MAX_HEADER_LINE = 2000;

async function htmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) return htmlFiles(path);
			return entry.name.endsWith('.html') ? [path] : [];
		}),
	);
	return nested.flat();
}

const hash = (value) => `'sha256-${createHash('sha256').update(value, 'utf8').digest('base64')}'`;
const sorted = (set) => [...set].sort().join(' ');

async function writeHeaders(dist, logger) {
	const scripts = new Set();
	const styles = new Set();
	for (const file of await htmlFiles(dist)) {
		const html = await readFile(file, 'utf8');
		for (const [, body] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) scripts.add(hash(body));
		for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) styles.add(hash(body));
		for (const [, value] of html.matchAll(/\sstyle="([^"]*)"/g)) styles.add(hash(value));
	}

	const policy = [
		"default-src 'none'",
		`script-src 'self' 'wasm-unsafe-eval' ${sorted(scripts)}`,
		`style-src 'self' 'unsafe-hashes' ${sorted(styles)}`,
		"img-src 'self' data:",
		"font-src 'self'",
		"connect-src 'self'",
		"manifest-src 'self'",
		"base-uri 'none'",
		"form-action 'none'",
		"frame-ancestors 'none'",
		'upgrade-insecure-requests',
	].join('; ');

	const cspLine = `  Content-Security-Policy: ${policy}`;
	if (cspLine.length > MAX_HEADER_LINE) {
		throw new Error('Content-Security-Policy is too long for _headers; reduce inline scripts or styles.');
	}

	const headers = `/*
${cspLine}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;

	await writeFile(join(dist, '_headers'), headers);
	logger.info(`Wrote _headers with ${scripts.size} script and ${styles.size} style hashes.`);
}

export default function securityHeaders() {
	return {
		name: 'openza:security-headers',
		hooks: {
			'astro:build:done': ({ dir, logger }) => writeHeaders(fileURLToPath(dir), logger),
		},
	};
}
