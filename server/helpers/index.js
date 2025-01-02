import assert from 'node:assert';

/**
 * @param {import('@mojojs/core').MojoContext} ctx
 * @param {boolean} condition
 * @param {string} message
 */
export async function validate(ctx, condition, message) {
  try {
    assert(condition, message);
  } catch (error) {
    await ctx.render({ json: { error: message }, status: 400 });
    throw error;
  }
}
