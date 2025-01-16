/**
 * @param {MojoContext} ctx
 * @param {string} username
 */
export async function setSession(ctx, username) {
  const session = await ctx.session();
  session.username = username;
  ctx.app.users.add(username);

  return session;
}

/**
 * @param {MojoContext} ctx
 */
export async function deleteSession(ctx) {
  const session = await ctx.session();
  ctx.app.users.delete(session.username ?? '');
  session.expires = 1;
}
