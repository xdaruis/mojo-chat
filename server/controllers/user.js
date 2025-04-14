import * as UserSchema from '../helpers/schemas/user.js';
import * as UserHelper from '../helpers/user.js';
import * as UserValidator from '../helpers/validators/user.js';

export default class UserController {
  /**
   * @param {MojoContext} ctx
   */
  async onLogin(ctx) {
    const payload = await ctx.parsedJsonRequest(UserSchema.onLogin);

    if (!payload) return;

    const { authCredentials } = payload;

    const credentials = await UserValidator.validateUserAuthCredentials(
      ctx,
      authCredentials,
    );

    if (!credentials) {
      return ctx.render({
        json: { error: 'Invalid credentials' },
        status: 401,
      });
    }

    const user = await ctx.app.prisma.users.findUnique({
      where: {
        provider_uuid: {
          provider: authCredentials.provider,
          uuid: credentials.uuid,
        },
      },
    });

    if (!user) {
      return ctx.render({
        json: { error: 'User not found' },
        status: 404,
      });
    }

    const session = await UserHelper.setSession(ctx, user.username);

    return ctx.render({ json: { session } });
  }

  /**
   * @param {MojoContext} ctx
   */
  async onRegister(ctx) {
    const payload = await ctx.parsedJsonRequest(UserSchema.onRegister);

    if (!payload) return;

    const { username, authCredentials } = payload;

    const credentials = await UserValidator.validateUserAuthCredentials(
      ctx,
      authCredentials,
    );

    if (!credentials) {
      return ctx.render({
        json: { error: 'Invalid credentials' },
        status: 401,
      });
    }

    try {
      const existingUser = await ctx.app.prisma.users.findFirst({
        where: {
          OR: [
            { username },
            {
              AND: {
                provider: authCredentials.provider,
                uuid: credentials.uuid,
              },
            },
          ],
        },
      });

      if (existingUser) {
        return ctx.render({
          json: { error: 'Username or account already registered' },
          status: 400,
        });
      }

      await ctx.app.prisma.users.create({
        data: {
          username: username,
          email: credentials.email,
          uuid: credentials.uuid,
          provider: authCredentials.provider,
        },
      });

      const session = await UserHelper.setSession(ctx, username);

      return ctx.render({ json: { session } });
    } catch (error) {
      ctx.app.log.error(
        `Registration error: ${JSON.stringify(error, null, 2)}`,
      );
      return ctx.render({
        json: { error: 'Registration failed' },
        status: 500,
      });
    }
  }

  /**
   * @param {MojoContext} ctx
   */
  async onLogout(ctx) {
    await UserHelper.deleteSession(ctx);

    return ctx.render({
      json: {
        message: 'Logout successful',
      },
    });
  }

  /**
   * @param {MojoContext} ctx
   */
  async getSession(ctx) {
    const { expiration: _, ...userData } = await ctx.session();

    return ctx.render({
      json: {
        session: userData,
      },
    });
  }
}
