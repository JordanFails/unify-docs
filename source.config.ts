import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const customPageSchema = pageSchema.extend({
  activeIcon: z.string().optional(),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: customPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig();
