export async function POST() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': 'mj_studio_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
    },
  });
}
