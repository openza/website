# Openza website

When working in the owner's Openza folder, read `../AGENTS.md` for shared Openza guidance. In a standalone checkout, keep source public-safe and run secret scanning before commits or pushes.

This is an assets-only public website. Keep Personal Cloud runtime code, task data, credentials, caches, and generated assets out of this repository.

Run `npm run build`, `npm test`, and `gitleaks detect --source . --verbose` before committing. Generated `dist/` is ignored. Do not deploy, alter Cloudflare resources, or promote OAuth without the user's authorization. Follow the task's managed-worktree workflow for implementation; the primary checkout stays on `main`.
