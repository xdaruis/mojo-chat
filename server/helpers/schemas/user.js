import { z } from 'zod';

export const onLogin = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(4, 'Username must be at least 4 characters')
    .max(15, 'Username must be at most 15 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and dashes',
    ),
});
