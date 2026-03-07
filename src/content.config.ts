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
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			status: z.string().default('in-progress'),
			featured: z.boolean().default(false),
			tags: z.string().optional(),
			repoUrl: z.string().optional(),
			liveUrl: z.string().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

const swiftProjects = defineCollection({
	loader: glob({ base: './src/content/swift-projects', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			platform: z.string().default('ios'),
			status: z.string().default('in-progress'),
			tags: z.string().optional(),
			repoUrl: z.string().optional(),
			appStoreUrl: z.string().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

const swiftBlog = defineCollection({
	loader: glob({ base: './src/content/swift-blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			tags: z.string().optional(),
		}),
});

const lab = defineCollection({
	loader: glob({ base: './src/content/lab', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			status: z.string().default('experiment'),
			tags: z.string().optional(),
			liveUrl: z.string().optional(),
			repoUrl: z.string().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

export const collections = { blog, projects, swiftProjects, swiftBlog, lab };
