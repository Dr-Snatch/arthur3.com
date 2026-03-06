export interface Project {
	title: string;
	description: string;
	link?: string;
	tags?: string[];
}

export const projects: Project[] = [
	{
		title: 'FocusKit',
		description: 'Minimal iOS productivity app. Focus sessions, task tracking, no notifications. Built to see how far SwiftUI gets you without reaching for UIKit.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Swift', 'SwiftUI', 'iOS'],
	},
	{
		title: 'inbox-zero',
		description: 'Python script that sorts, labels, and archives emails by rules. Runs on a schedule. Reduced my inbox management to zero manual effort.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Python', 'Automation'],
	},
	{
		title: 'devboard',
		description: 'Small personal dashboard that aggregates GitHub activity, tasks, and notes. Built in TypeScript and React. Deployed on Cloudflare.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['TypeScript', 'React', 'Cloudflare'],
	},
	{
		title: 'promptkit',
		description: 'Tool for experimenting with LLM prompts. Store, version, and compare outputs across different models. Ongoing project.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Python', 'LLMs', 'FastAPI'],
	},
];
