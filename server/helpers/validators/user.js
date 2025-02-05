import axios from 'axios';

/**
 * @param {MojoContext} ctx
 * @param {{ provider: 'GOOGLE', token: string }} authCredentials
 */
export async function validateUserAuthCredentials(ctx, authCredentials) {
  if (authCredentials.provider === 'GOOGLE') {
    try {
      const { data } = await axios.get(
        'https://oauth2.googleapis.com/tokeninfo',
        {
          params: { access_token: authCredentials.token },
        },
      );

      return {
        email: data.email,
        uuid: data.sub,
      };
    } catch (/** @type {any} */ error) {
      ctx.log.error(
        `Google verification error: ${error?.response?.data || error.message}`,
      );
    }
  }

  return null;
}
