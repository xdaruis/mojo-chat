import * as UserSchemas from '../helpers/schemas/user.js';
import * as UserHelper from '../helpers/user.js';

export default class UserController {
  /**
   * @param {MojoCtx} ctx
   */
  async onLogin(ctx) {
    const payload = await ctx.parsedJsonRequest(UserSchemas.onLogin);

    if (!payload) return;
    const { username } = payload;

    let session = await ctx.session();

    await ctx.validate(
      !ctx.app.users.has(username) && session.username === undefined,
      'User already connected',
    );

    session = await UserHelper.setSession(ctx, username);

    return ctx.render({ json: { session } });
  }

  /**
   * @param {MojoCtx} ctx
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
   * @param {MojoCtx} ctx
   */
  async getSession(ctx) {
    const session = await ctx.session();

    return ctx.render({
      json: {
        session: session,
      },
    });
  }
}
