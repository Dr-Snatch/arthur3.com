// Project data - add your projects here
// This makes it super easy to manage your portfolio without touching components

export interface Project {
	title: string;
	description: string;
	link?: string;
	tags?: string[];
}

export const projects: Project[] = [
	{
		title: 'Project Alpha',
		description: 'A sophisticated web application built with modern technologies. Features include real-time updates and seamless user experience.',
		link: '#',
		tags: ['React', 'TypeScript', 'Node.js'],
	},
	{
		title: 'Design System',
		description: 'Comprehensive UI component library with accessibility at its core. Used across multiple products.',
		link: '#',
		tags: ['Design', 'CSS', 'Storybook'],
	},
	{
		title: 'API Platform',
		description: 'Scalable REST API serving millions of requests daily. Built with performance and reliability in mind.',
		link: '#',
		tags: ['Python', 'PostgreSQL', 'Redis'],
	},
];
