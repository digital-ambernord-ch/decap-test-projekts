export async function onRequest(context) {
  const { GITHUB_CLIENT_ID } = context.env;
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;
  return Response.redirect(url, 302);
}
