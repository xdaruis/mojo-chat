/**
 * @param {MojoContext} ctx
 * @param {boolean} condition
 * @param {string} message
 */
export async function validate(ctx, condition, message) {
  if (!condition) {
    await ctx.render({ json: { error: message }, status: 400 });
    return false;
  }
  return true;
}

/**
 * @template T
 * @param {import('@mojojs/core').MojoContext} ctx
 * @param {import('zod').ZodObject<any>} schema
 * @returns {Promise<T>}
 */
export async function parsedJsonRequest(ctx, schema) {
  const json = await ctx.req.json();
  const result = schema.strict().safeParse(json);

  if (!result.success) {
    await ctx.render({
      json: { error: result.error.errors[0]?.message },
      status: 400,
    });
  }

  return /** @type {T} */ (result.data ?? null);
}
