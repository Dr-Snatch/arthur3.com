export interface Project {
	title: string;
	description: string;
	link?: string;
	tags?: string[];
}

export const projects: Project[] = [
	{
		title: 'AI Security Scanner',
		description: 'Tool that analyses web applications for common vulnerabilities using LLM-powered reasoning. Identifies OWASP Top 10 issues and suggests mitigations.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Python', 'LLM', 'FastAPI', 'Security'],
	},
	{
		title: 'Autonomous Research Agent',
		description: 'Multi-step AI agent that autonomously researches topics, synthesises information from multiple sources, and generates structured reports.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Python', 'LangChain', 'OpenAI', 'RAG'],
	},
	{
		title: 'CTF Toolkit',
		description: 'Collection of scripts and utilities for Capture The Flag competitions — cryptography helpers, binary analysis, and web exploitation aids.',
		link: 'https://github.com/Dr-Snatch',
		tags: ['Python', 'Bash', 'Security', 'Linux'],
	},
	{
		title: 'arthur3.com',
		description: 'This site — a personal lab and build log. Built with Astro, deployed on Cloudflare. Fast, minimal, and easy to update.',
		link: 'https://github.com/Dr-Snatch/arthur3.com',
		tags: ['Astro', 'TypeScript', 'Cloudflare'],
	},
];
