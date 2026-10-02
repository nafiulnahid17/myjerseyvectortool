import { env } from 'cloudflare:workers';

function credentials() {
  const e = env as unknown as Record<string, string | undefined>;
  return {
    username: e.MASTER_ADMIN_USERNAME || 'masteradmin',
    password: e.MASTER_ADMIN_PASSWORD || '179501',
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const configured = credentials();

    if (body.username !== configured.username || body.password !== configured.password) {
      return Response.json({ ok: false, error: 'Invalid username or password.' }, { status: 401 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': 'mj_studio_session=masteradmin; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000',
      },
    });
  } catch {
    return Response.json({ ok: false, error: 'Could not process login.' }, { status: 400 });
  }
}
