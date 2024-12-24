export default class ExampleController {
  async welcome (ctx) {
    await ctx.render({json: {message: 'Hello'}});
  }
}
