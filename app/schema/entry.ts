import { z } from 'zod';

const entrySchema = z.object({
  id: z.number(),
  timestamp: z.number(),
});

export { entrySchema };
export type Entry = z.infer<typeof entrySchema>;