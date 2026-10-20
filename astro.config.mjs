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
				{
					label: 'Openza Tasks',
					items: [
						{ label: 'Overview', slug: 'tasks' },
						{ label: 'Install', slug: 'tasks/install' },
						{ label: 'Getting around', slug: 'tasks/getting-around' },
						{ label: 'Working with tasks', slug: 'tasks/working-with-tasks' },
						{ label: 'Spaces, projects and labels', slug: 'tasks/organize' },
						{ label: 'Connected apps', slug: 'tasks/connected-apps' },
						{ label: 'GitHub issues', slug: 'tasks/github-issues' },
						{ label: 'Backup and recovery', slug: 'tasks/backup' },
						{ label: 'Markdown import and export', slug: 'tasks/markdown' },
						{ label: 'Command line', slug: 'tasks/command-line' },
					],
				},
				{
					label: 'Personal Cloud',
					badge: { text: 'Preview', variant: 'note' },
					items: [
						{ label: 'Overview', slug: 'personal-cloud' },
						{ label: 'Privacy and security', slug: 'privacy' },
					],
				},
				{
					label: 'Openza Reader',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'reader' },
						{ label: 'Introduction', slug: 'reader/getting-started/introduction' },
						{ label: 'Installation', slug: 'reader/getting-started/installation' },
						{ label: 'Reading Markdown', slug: 'reader/getting-started/reading-markdown' },
						{ label: 'Markdown support', slug: 'reader/features/markdown-rendering' },
						{ label: 'Navigation and search', slug: 'reader/features/navigation-search' },
						{ label: 'Safety and remote content', slug: 'reader/features/security-model' },
					],
				},
				{
					label: 'Openza Flow',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'flow' },
						{ label: 'Introduction', slug: 'flow/getting-started/introduction' },
						{ label: 'Installation', slug: 'flow/getting-started/installation' },
						{ label: 'Agent sessions', slug: 'flow/features/agent-sessions' },
						{ label: 'GitHub sign-in', slug: 'flow/getting-started/github-token' },
						{ label: 'GitHub activity', slug: 'flow/features/pr-inbox' },
						{ label: 'Reviewing pull requests', slug: 'flow/guides/reviewing-prs' },
						{ label: 'Notifications', slug: 'flow/guides/notifications' },
						{ label: 'Privacy', slug: 'flow/privacy' },
						{ label: 'Support', slug: 'flow/support' },
					],
				},
			],
		}),
		securityHeaders(),
	],
});
