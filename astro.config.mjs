// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import securityHeaders from './integrations/security-headers.mjs';

export default defineConfig({
	site: 'https://openza.org',
	trailingSlash: 'always',
	build: { inlineStylesheets: 'never' },
	integrations: [
		sitemap(),
		starlight({
			title: 'Openza',
			description: 'Focused, local-first, open-source tools for everyday work.',
			logo: { src: './src/assets/openza.svg', alt: 'Openza' },
			favicon: '/openza.svg',
			customCss: ['@fontsource-variable/inter', './src/styles/theme.css'],
			social: [{ icon: 'github', label: 'Openza on GitHub', href: 'https://github.com/openza' }],
			lastUpdated: false,
			pagination: true,
			sidebar: [
				{ label: 'All docs', slug: 'docs' },
				{ label: 'Privacy and security', slug: 'privacy' },
				{
					label: 'Openza Tasks',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'docs/tasks' },
						{ label: 'Install', slug: 'docs/tasks/install' },
						{ label: 'Getting around', slug: 'docs/tasks/getting-around' },
						{ label: 'Working with tasks', slug: 'docs/tasks/working-with-tasks' },
						{ label: 'Spaces, projects and labels', slug: 'docs/tasks/organize' },
						{ label: 'Connected apps', slug: 'docs/tasks/connected-apps' },
						{ label: 'GitHub issues', slug: 'docs/tasks/github-issues' },
						{ label: 'Backup and recovery', slug: 'docs/tasks/backup' },
						{ label: 'Markdown import and export', slug: 'docs/tasks/markdown' },
						{ label: 'Command line', slug: 'docs/tasks/command-line' },
						{ label: 'Personal Cloud', slug: 'docs/tasks/personal-cloud', badge: { text: 'Preview', variant: 'note' } },
					],
				},
				{
					label: 'Openza Reader',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'docs/reader' },
						{ label: 'Introduction', slug: 'docs/reader/getting-started/introduction' },
						{ label: 'Installation', slug: 'docs/reader/getting-started/installation' },
						{ label: 'Reading Markdown', slug: 'docs/reader/getting-started/reading-markdown' },
						{ label: 'Markdown support', slug: 'docs/reader/features/markdown-rendering' },
						{ label: 'Navigation and search', slug: 'docs/reader/features/navigation-search' },
						{ label: 'Safety and remote content', slug: 'docs/reader/features/security-model' },
					],
				},
				{
					label: 'Openza Flow',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'docs/flow' },
						{ label: 'Introduction', slug: 'docs/flow/getting-started/introduction' },
						{ label: 'Installation', slug: 'docs/flow/getting-started/installation' },
						{ label: 'Agent sessions', slug: 'docs/flow/features/agent-sessions' },
						{ label: 'GitHub sign-in', slug: 'docs/flow/getting-started/github-token' },
						{ label: 'GitHub activity', slug: 'docs/flow/features/pr-inbox' },
						{ label: 'Reviewing pull requests', slug: 'docs/flow/guides/reviewing-prs' },
						{ label: 'Notifications', slug: 'docs/flow/guides/notifications' },
						{ label: 'Privacy', slug: 'docs/flow/privacy' },
						{ label: 'Support', slug: 'docs/flow/support' },
					],
				},
			],
		}),
		securityHeaders(),
	],
});
