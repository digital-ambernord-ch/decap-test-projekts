export async function onRequest(context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code })
  });

  const data = await response.json();
  const token = data.access_token;
  const content = JSON.stringify({ token, provider: 'github' });

  return new Response(
    `<!DOCTYPE html><html><body><script>
    (function() {
      var msg = 'authorization:github:success:' + ${JSON.stringify(content)};
      window.opener.postMessage(msg, location.origin.replace('github-oauth-proxy.eriksmatisonsvd.workers.dev', 'ambernord-admin.pages.dev'));
      window.close();
    })();
    <\/script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
