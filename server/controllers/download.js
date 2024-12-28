export default class DownloadController {
  /**
   * @param {MojoCtx} ctx
   */
  async serveReact(ctx) {
    const uri = ctx.req.url?.split('?')[0] ?? '/';

    try {
      const path = ctx.home.child('../client/dist', uri);
      const stats = await path.stat();

      if (!stats.isDirectory()) {
        await ctx.sendFile(path);
        return;
      }
    } catch (error) {
      // default to index.html
    }

    await ctx.sendFile(ctx.home.child('../client/dist/index.html'));
  }
}
