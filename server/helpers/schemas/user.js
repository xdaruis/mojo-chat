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

const authCredentials = z.object(
  {
    provider: z.enum(['GOOGLE'], {
      required_error: 'Authentication provider is required',
      invalid_type_error: 'Invalid authentication provider',
    }),
    token: z.string({
      required_error: 'Authentication token is required',
      invalid_type_error: 'Token must be a string',
    }),
  },
  {
    required_error: 'Authentication credentials are required',
  },
);

export const onLogin = z.object({
  authCredentials: authCredentials,
});

export const onRegister = z.object({
  username: username,
  authCredentials: authCredentials,
});
