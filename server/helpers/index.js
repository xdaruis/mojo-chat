/**
 * @template T
 * @param {MojoContext} ctx
 * @param {import('zod').ZodObject<any>} schema
 * @returns {Promise<T>}
 */
export async function parsedJsonRequest(ctx, schema) {
  const json = await ctx.req.json();
  const result = schema.strict().safeParse(json);

  if (!result.success) {
    await ctx.render({
      json: { error: result.error.errors[0]?.message || 'Unexpected error' },
      status: 400,
    });
  }

  return /** @type {T} */ (result.data ?? null);
}
