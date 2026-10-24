import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    series: reference('series').optional(),
    seriesOrder: z.number().int().positive().optional(),
  }).refine(data => (data.series !== undefined) === (data.seriesOrder !== undefined), {
    message: 'series 与 seriesOrder 必须同时提供或同时省略',
    path: ['seriesOrder'],
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    order: z.number().int().positive(),
  }),
});

export const collections = { posts, series };
