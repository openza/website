// The apps shown on the home page. Add an entry here to list a new app.
// Taglines come from each app's README; keep them in sync when a README changes.

export interface Download {
	platform: string;
	store: string;
	href: string;
}

export interface App {
	name: string;
	icon: string;
	tagline: string;
	guide: string;
	source: string;
	downloads: Download[];
	note?: string;
}

const microsoftStore = (id: string) => `https://apps.microsoft.com/detail/${id}`;

export const apps: App[] = [
	{
		name: 'Openza Tasks',
		icon: '/tasks.svg',
		tagline: 'A simple local-first task app that grows with you, with an optional cloud you control.',
		guide: '/tasks/',
		source: 'https://github.com/openza/tasks',
		downloads: [
			{ platform: 'Linux', store: 'Snap Store', href: 'https://snapcraft.io/openza-tasks' },
			{ platform: 'Windows', store: 'Microsoft Store', href: microsoftStore('9NQGDKXGRGF8') },
		],
		note: 'An updated Windows version is in progress. macOS is planned.',
	},
	{
		name: 'Openza Reader',
		icon: '/reader.svg',
		tagline: 'A native Markdown reader for Windows.',
		guide: '/reader/',
		source: 'https://github.com/openza/reader',
		downloads: [{ platform: 'Windows', store: 'Microsoft Store', href: microsoftStore('9NNPMN0JSSW5') }],
	},
	{
		name: 'Openza Flow',
		icon: '/flow.svg',
		tagline: 'A local-first Windows companion for developer workflows.',
		guide: '/flow/',
		source: 'https://github.com/openza/flow',
		downloads: [{ platform: 'Windows', store: 'Microsoft Store', href: microsoftStore('9N37DN0X68PZ') }],
	},
];
