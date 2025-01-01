import * as UserHelper from '../helpers/user.js';
import * as UserValidator from '../helpers/validators/user.js';

export default class UserController {
  /**
   * @param {MojoCtx} ctx
   */
  async onLogin(ctx) {
    /** @type {{ username: string }} */
    const { username } = await ctx.req.json();
    let session = await ctx.session();

    await ctx.validate(!!username, 'Username is required');
    await ctx.validate(
      typeof username === 'string',
      'Username must be a string',
    );
    await ctx.validate(
      !ctx.app.users.has(username) && session.username === undefined,
      'User already connected',
    );
    await ctx.validate(
      UserValidator.isValidUsername(username),
      'The username is not valid',
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
