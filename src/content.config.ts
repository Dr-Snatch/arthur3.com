import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			draft: z.boolean().default(false),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			headline: z.string().optional(),
			problem: z.string().optional(),
			system: z.string().optional(),
			result: z.string().optional(),
			status: z.enum(['in-progress', 'released', 'on-hold', 'archived']).default('in-progress'),
			featured: z.boolean().default(false),
			flagship: z.boolean().default(false),
			tags: z.string().optional(),
			repoUrl: z.string().optional(),
			liveUrl: z.string().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

const lab = defineCollection({
	loader: glob({ base: './src/content/lab', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			problem: z.string().optional(),
			approach: z.string().optional(),
			result: z.string().optional(),
			status: z.enum(['experiment', 'prototype', 'shipped', 'abandoned']).default('experiment'),
			tags: z.string().optional(),
			liveUrl: z.string().optional(),
			repoUrl: z.string().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

export const collections = { blog, projects, lab };
