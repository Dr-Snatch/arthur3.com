export interface Project {
	title: string;
	description: string;
	link?: string;
	tags?: string[];
}

// Smaller "other" projects shown below the featured cards
export const projects: Project[] = [
	{
		title: 'file-organiser',
		description: 'Python script that watches the downloads folder and auto-sorts files by type and date. Solves a genuinely annoying problem.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Python', 'Automation'],
	},
	{
		title: 'devboard',
		description: 'Personal dashboard in TypeScript/React. Aggregates GitHub activity, tasks, and notes in one place. Deployed on Cloudflare.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['TypeScript', 'React', 'Cloudflare'],
	},
];
