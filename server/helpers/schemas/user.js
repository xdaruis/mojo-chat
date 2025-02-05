import { z } from 'zod';

const username = z
  .string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
  .min(4, 'Username must be at least 4 characters')
  .max(15, 'Username must be at most 15 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and dashes',
  );

const authCredentials = z.object({
  provider: z.enum(['GOOGLE']),
  token: z.string(),
});

export const onLogin = z.object({
  username: username,
  authCredentials: authCredentials.optional(),
});

export const onRegister = z.object({
  username: username,
  authCredentials: authCredentials,
});
