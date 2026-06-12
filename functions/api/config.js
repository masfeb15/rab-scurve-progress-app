export async function onRequestGet(context) {
  return Response.json({
    supabaseConfigured: Boolean(context.env.VITE_SUPABASE_URL || context.env.SUPABASE_URL),
    mode: 'frontend-supabase-rls'
  });
}
