// 목행성 간트 → 통합 회원 시스템(goodgamedu-account-service) 중계 함수
// 브라우저는 같은 주소(/api/account/*)만 부르고, 이 함수가 회원 서비스로 전달합니다.
// 덕분에 로그인 쿠키가 이 사이트 안에서만 쓰입니다.
const PREFIX = '/api/account';
const DEFAULT_BASE = 'https://goodgamedu-account-service.goodgamedu-account-service.workers.dev';
const ALLOW = [
  /^\/v1\/me$/,
  /^\/v1\/growth\/.+/,
  /^\/v1\/auth\/start\/(google|kakao)$/,
  /^\/api\/auth\/.+/,
];

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const sub = url.pathname.startsWith(PREFIX) ? url.pathname.slice(PREFIX.length) : url.pathname;
  if (!ALLOW.some(re => re.test(sub))) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  // 로그인 도중 오류 화면(영어 ERROR 페이지) 대신 앱으로 돌려보내, 이미 로그인된 경우엔 바로 열리고 아니면 안내 문구가 나오게 함
  if (sub === '/api/auth/error') {
    const code = (url.searchParams.get('error') || 'login_failed').replace(/[^a-z0-9_]/gi, '').slice(0, 40) || 'login_failed';
    return new Response(null, { status: 302, headers: { Location: '/?error=' + code, 'Cache-Control': 'no-store' } });
  }

  // 로그인 처리 경로는 원래 주소 그대로, 나머지는 앞부분(/api/account)을 뗀 주소로 전달
  const targetPath = sub.startsWith('/api/auth/') ? url.pathname : sub;
  const base = (env.ACCOUNT_SERVICE_URL || DEFAULT_BASE).replace(/\/$/, '');
  const target = new URL(base + targetPath + url.search);

  const headers = new Headers(request.headers);
  headers.set('X-GoodGamedu-Auth-Base-URL', url.origin + PREFIX);
  headers.delete('host');

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const init = {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: 'manual',
  };

  const res = env.ACCOUNT
    ? await env.ACCOUNT.fetch(new Request(target.toString(), init))
    : await fetch(target.toString(), init);

  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'no-store');
  return out;
}
