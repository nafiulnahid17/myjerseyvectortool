function hasSession(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').some((part) => part.trim() === 'mj_studio_session=masteradmin');
}

export async function GET(request: Request) {
  return Response.json({ authenticated: hasSession(request) });
}
