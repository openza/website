import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('./dist/', import.meta.url));

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

const pages = await htmlFiles(dist);

test('expected pages are built', async () => {
	for (const path of [
		'index.html',
		'404.html',
		'tasks/index.html',
		'reader/index.html',
		'flow/index.html',
		'docs/index.html',
		'docs/tasks/index.html',
		'docs/tasks/install/index.html',
		'docs/tasks/personal-cloud/index.html',
		'docs/reader/index.html',
		'docs/flow/index.html',
		'docs/flow/privacy/index.html',
		'docs/flow/support/index.html',
		'privacy/index.html',
	]) {
		assert.ok((await stat(dist + path)).isFile(), `Missing ${path}`);
	}
});

for (const file of pages) {
	const name = relative(dist, file);
	test(`${name}: accessible shell, local assets, no tracking`, async () => {
		const html = await readFile(file, 'utf8');
		assert.match(html, /<html[^>]* lang="en"/);
		assert.match(html, /name="viewport"/);
		assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'exactly one h1');
		assert.match(html, /href="#main"|href="#_top"/, 'skip link');
		assert.doesNotMatch(html, /<iframe|<form|\son(?:click|load|error)=/i);
		assert.doesNotMatch(html, /https?:\/\/(?:[\w-]+\.)*solanky\.dev/, 'Openza pages must not link to solanky.dev');
		assert.doesNotMatch(
			html,
			/source repository is currently private|OAuth client is currently private|New-user Cloudflare authorization is not yet publicly available/,
			'Do not retain outdated source or OAuth visibility claims',
		);
		for (const [, src] of html.matchAll(/<(?:script|img)[^>]+src="([^"]+)"/g)) {
			assert.ok(src.startsWith('/'), `Third-party resource: ${src}`);
		}
		for (const [, href] of html.matchAll(/<link[^>]+rel="(?:stylesheet|preload|modulepreload)"[^>]+href="([^"]+)"/g)) {
			assert.ok(href.startsWith('/'), `Third-party stylesheet: ${href}`);
		}
		for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
			const target = dist + url.slice(1) + (url.endsWith('/') ? 'index.html' : '');
			assert.ok((await stat(target)).isFile(), `Missing local asset or link: ${url}`);
		}
	});
}

test('home and product pages have no inline JavaScript', async () => {
	for (const path of ['index.html', 'tasks/index.html', 'reader/index.html', 'flow/index.html']) {
		const html = await readFile(dist + path, 'utf8');
		assert.doesNotMatch(html, /<script(?![^>]*\bsrc="\/)/i, path);
	}
});

test('product pages show platform downloads and link features to their guides', async () => {
	const tasks = await readFile(dist + 'tasks/index.html', 'utf8');
	assert.match(tasks, /class="platform">Linux</);
	assert.match(tasks, /class="platform">Windows</);
	assert.match(tasks, /href="\/docs\/tasks\/personal-cloud\/"[\s\S]*?Preview/);
	for (const app of ['reader', 'flow']) {
		const html = await readFile(dist + app + '/index.html', 'utf8');
		assert.match(html, /class="platform">Windows</);
		assert.match(html, new RegExp(`href="/docs/${app}/`));
	}
});

test('links shipped in the apps still resolve', async () => {
	const redirects = await readFile(dist + '_redirects', 'utf8');
	for (const path of ['/flow/privacy/', '/flow/support/', '/personal-cloud/']) {
		assert.match(redirects, new RegExp(`^${path} /docs/`, 'm'), path);
	}
});

test('privacy and onboarding limitations remain explicit', async () => {
	const cloud = await readFile(dist + 'docs/tasks/personal-cloud/index.html', 'utf8');
	const privacy = await readFile(dist + 'privacy/index.html', 'utf8');
	assert.match(cloud, /Personal Cloud is still a preview/);
	assert.match(cloud, /OAuth client is public/);
	assert.match(privacy, /https:\/\/github\.com\/openza\/personal-cloud/);
	assert.match(privacy, /not<\/strong> provide end-to-end encryption/);
	assert.match(privacy, /Signing out does not erase/);
});

test('security headers are strict', async () => {
	const headers = await readFile(dist + '_headers', 'utf8');
	assert.match(headers, /default-src 'none'/);
	assert.match(headers, /frame-ancestors 'none'/);
	assert.match(headers, /base-uri 'none'/);
	assert.doesNotMatch(headers, /'unsafe-inline'|'unsafe-eval'|https?:\/\//);
	for (const line of headers.split('\n')) assert.ok(line.length <= 2000, 'header line too long');
});

test('old guide URLs redirect to existing pages', async () => {
	const redirects = await readFile(dist + '_redirects', 'utf8');
	for (const line of redirects.split('\n').filter((l) => l && !l.startsWith('#'))) {
		const [, target, status] = line.split(/\s+/);
		assert.equal(status, '301');
		assert.ok((await stat(dist + target.slice(1) + 'index.html')).isFile(), `Redirect target missing: ${target}`);
	}
});
