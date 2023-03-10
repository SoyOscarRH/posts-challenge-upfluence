import type { DayOfWeek, HourOfDay } from '~/types/moment';

import { z } from 'zod';
import { entrySchema } from './entry';

const PostSchema = z.union([
  z.object({ pin: entrySchema }),
  z.object({ instagram_media: entrySchema }),
  z.object({ youtube_video: entrySchema }),
  z.object({ article: entrySchema }),
  z.object({ tweet: entrySchema }),
  z.object({ facebook_status: entrySchema }),
]).transform((value) => {
  const [key, values] = Object.entries(value)[0];
  return { ...values, type: key };
}).transform((value) => {
  const { timestamp } = value;

  const date = new Date(timestamp * 1_000);
  const day = date.getUTCDay() as DayOfWeek;
  const hour = date.getUTCHours() as HourOfDay;
  return { ...value, day, hour }
});

export { PostSchema };
export type Post = z.infer<typeof PostSchema>;