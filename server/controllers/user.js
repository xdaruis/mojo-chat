import assert from 'node:assert';

import * as UserHelper from '../helpers/user.js';
import * as UserValidator from '../helpers/validators/user.js';

export default class UserController {
  /**
   * @param {MojoCtx} ctx
   */
  async onLogin(ctx) {
    /** @type {{ username: string }} */
    const { username } = await ctx.req.json();

    assert(username, 'Username is required');
    assert(typeof username === 'string', 'Username must be a string');

    if (ctx.app.users.has(username)) {
      return ctx.render({
        json: { error: 'User already connected' },
        status: 400,
      });
    }

    if (!UserValidator.isValidUsername(username)) {
      return ctx.render({
        json: { error: 'Invalid username' },
        status: 400,
      });
    }

    const session = await UserHelper.setSession(ctx, username);

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
