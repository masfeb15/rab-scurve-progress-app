export async function onRequestGet(context) {
  return Response.json({ ok: true, app: 'rab-scurve-progress-app', runtime: 'cloudflare-pages-functions' });
}
