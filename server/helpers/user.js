/**
 * @param {MojoContext} ctx
 * @param {string} username
 */
export async function setSession(ctx, username) {
  const session = await ctx.session();
  session.username = username;
  session.expiration = 7 * 24 * 60 * 60; // 1 week expiration
  ctx.app.users.add(username);

  const { expiration: _, ...userData } = session;
  return userData;
}

/**
 * @param {MojoContext} ctx
 */
export async function deleteSession(ctx) {
  const session = await ctx.session();
  ctx.app.users.delete(session.username ?? '');
  session.expires = 1;
}
