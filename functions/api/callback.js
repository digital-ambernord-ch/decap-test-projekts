export async function onRequest(context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code
    })
  });

  const data = await response.json();
  const token = data.access_token;

  const html = `<!DOCTYPE html>
<html><body><script>
(function() {
  var token = ${JSON.stringify(token)};
  var msg = "authorization:github:success:" + JSON.stringify({token: token, provider: "github"});
  window.opener.postMessage(msg, "https://ambernord-admin.pages.dev");
  window.close();
})();
<\/script></body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
