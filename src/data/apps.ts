// The apps shown on the home page. Each entry also builds the app's product page at /<id>/.
// Add an entry here to list a new app, and put its guides under src/content/docs/docs/<id>/.
// Taglines come from each app's README; keep them in sync when a README changes.
// Feature titles and descriptions come from the linked guide pages, so the wording lives in one place.

export interface Download {
	platform: string;
	store: string;
	href: string;
}

export interface Feature {
	/** Guide page id, as used in the Starlight sidebar. */
	doc: string;
	preview?: boolean;
}

export interface App {
	id: string;
	name: string;
	icon: string;
	tagline: string;
	source: string;
	install: string;
	downloads: Download[];
	features: Feature[];
}

const microsoftStore = (id: string) => `https://apps.microsoft.com/detail/${id}`;

export const apps: App[] = [
	{
		id: 'tasks',
		name: 'Openza Tasks',
		icon: '/tasks.svg',
		tagline: 'A simple local-first task app that grows with you, with an optional cloud you control.',
		source: 'https://github.com/openza/tasks',
		install: 'docs/tasks/install',
		downloads: [
			{ platform: 'Linux', store: 'Snap Store', href: 'https://snapcraft.io/openza-tasks' },
			{ platform: 'Windows', store: 'Microsoft Store', href: microsoftStore('9NQGDKXGRGF8') },
		],
		features: [
			{ doc: 'docs/tasks/working-with-tasks' },
			{ doc: 'docs/tasks/organize' },
			{ doc: 'docs/tasks/getting-around' },
			{ doc: 'docs/tasks/connected-apps' },
			{ doc: 'docs/tasks/github-issues' },
			{ doc: 'docs/tasks/backup' },
			{ doc: 'docs/tasks/markdown' },
			{ doc: 'docs/tasks/command-line' },
			{ doc: 'docs/tasks/personal-cloud', preview: true },
		],
	},
	{
		id: 'reader',
		name: 'Openza Reader',
		icon: '/reader.svg',
		tagline: 'A native Markdown reader for Windows.',
		source: 'https://github.com/openza/reader',
		install: 'docs/reader/getting-started/installation',
		downloads: [{ platform: 'Windows', store: 'Microsoft Store', href: microsoftStore('9NNPMN0JSSW5') }],
		features: [
			{ doc: 'docs/reader/getting-started/reading-markdown' },
			{ doc: 'docs/reader/features/markdown-rendering' },
			{ doc: 'docs/reader/features/navigation-search' },
			{ doc: 'docs/reader/features/security-model' },
		],
	},
	{
		id: 'flow',
		name: 'Openza Flow',
		icon: '/flow.svg',
		tagline: 'A local-first Windows companion for developer workflows.',
		source: 'https://github.com/openza/flow',
		install: 'docs/flow/getting-started/installation',
		downloads: [{ platform: 'Windows', store: 'Microsoft Store', href: microsoftStore('9N37DN0X68PZ') }],
		features: [
			{ doc: 'docs/flow/features/agent-sessions' },
			{ doc: 'docs/flow/features/pr-inbox' },
			{ doc: 'docs/flow/guides/reviewing-prs' },
			{ doc: 'docs/flow/guides/notifications' },
			{ doc: 'docs/flow/getting-started/github-token' },
		],
	},
];

export const docsHref = (doc: string) => `/${doc}/`;
