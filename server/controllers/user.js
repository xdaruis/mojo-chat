import * as UserSchema from '../helpers/schemas/user.js';
import * as UserHelper from '../helpers/user.js';

export default class UserController {
  /**
   * @param {MojoContext} ctx
   */
  async onLogin(ctx) {
    const payload = await ctx.parsedJsonRequest(UserSchema.onLogin);

    if (!payload) return;
    const { username } = payload;

    let session = await ctx.session();

    if (
      !(await ctx.validate(
        !ctx.app.users.has(username) && session.username === undefined,
        'User already connected',
      ))
    ) {
      return;
    }

    session = await UserHelper.setSession(ctx, username);

    return ctx.render({ json: { session } });
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
    const session = await ctx.session();

    return ctx.render({
      json: {
        session: session,
      },
    });
  }
}
