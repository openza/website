# Openza website

Source for [openza.org](https://openza.org/): the Openza Tasks product site, user guides for Tasks, Reader, and Flow, and the Personal Cloud and privacy pages.

It is a static [Astro](https://astro.build/) site with one [Starlight](https://starlight.astro.build/) documentation instance, deployed as an assets-only Cloudflare Worker with Wrangler. No D1 bindings, credentials, task data, analytics, or account registration.

## Structure

- `src/data/apps.ts` — the app list; each entry appears on the home page and builds a product page at `/<app>/`
- `src/pages/index.astro`, `src/pages/[app]/index.astro`, `src/layouts/Site.astro` and `src/styles/home.css` — home and product pages (no inline JavaScript)
- `src/content/docs/docs/tasks/`, `reader/`, `flow/` — guides served under `/docs/<app>/`; Personal Cloud is part of the Tasks guide
- `src/content/docs/privacy.mdx` — privacy and security
- `public/_redirects` — old guide URLs, including ones shipped in the apps, redirected to their current pages
- `src/styles/theme.css` — Starlight theme
- `integrations/security-headers.mjs` — writes `dist/_headers` with a hash-based Content-Security-Policy after each build
- `wrangler.jsonc` — assets-only Worker and the `openza.org` custom domain
- `public/` — logos, `robots.txt`

## Build and check

Requires Node.js 22.18 or newer.

```sh
npm ci
npm run dev       # http://127.0.0.1:4321
npm run build
npm test
npm run preview   # http://127.0.0.1:8799
```

`dist/` and Cloudflare build output are ignored. Generated output must not be committed.

The build allows only first-party scripts and styles. Inline scripts and style attributes that Starlight emits are allowed by SHA-256 hash, computed after each build. The build fails if the policy no longer fits Cloudflare's 2,000-character `_headers` line limit.

## Writing guides

Guides describe the released app. Check behavior against the [Tasks source](https://github.com/openza/tasks) before documenting it, and label anything that is only on the Snap edge channel as a preview. Personal Cloud must stay labeled as a preview until it is explicitly released.

## Deploy

Deployment uploads `dist/` to the assets-only Worker `openza-website` with Wrangler. There is no Worker code and no bindings. Review the configuration and the authenticated account first.

```sh
npm run build
npm test
npx wrangler deploy --dry-run
npm run deploy
```

The `cf` CLI is not used here: it detects Astro and expects the Astro Cloudflare adapter, which builds a server Worker this static site does not need.

The custom domain is `openza.org`. Cloudflare manages its DNS and certificate. Preserve the existing OAuth publisher-verification TXT record.

## Licensing and branding

The website source code is MIT licensed. Guide text, Openza names, and logos are not; see [CONTENT_LICENSE.md](./CONTENT_LICENSE.md). The Openza logo is `/openza.svg`, with `/tasks.svg`, `/reader.svg`, `/flow.svg`, and `/wordmark.svg`.
