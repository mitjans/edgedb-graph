import * as v from 'valibot';

const bodySchema = v.variant('provider', [
  v.object({
    provider: v.literal('builtin::local_emailpassword'),
    email: v.string(),
    password: v.string(),
  }),
  v.object({
    provider: v.literal('builtin::oauth_google'),
    email: v.undefined_(),
    password: v.undefined_(),
  }),
]);

export default defineEventHandler(async (event) => {
  const { password, provider, email } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));

  const { challenge, verifier } = generatePKCE();

  const {
    edgedb: { authBaseUrl },
  } = useRuntimeConfig();

  if (provider === 'builtin::oauth_google') {
    const { origin } = getRequestURL(event);
    const redirectUrl = new URL('authorize', authBaseUrl);
    redirectUrl.searchParams.set('provider', provider);
    redirectUrl.searchParams.set('challenge', challenge);
    redirectUrl.searchParams.set('redirect_to', `${origin}/callback/google`);

    setCookie(event, 'edgedb-pkce-verifier', verifier, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { redirect: redirectUrl.href };
  }

  const authenticateUrl = new URL('authenticate', authBaseUrl);
  const authenticateResponse = await fetch(authenticateUrl.href, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge,
      email,
      password,
      provider,
    }),
  });

  if (!authenticateResponse.ok) {
    const {
      error: { message },
    } = await authenticateResponse.json();
    throw createError({ status: 400, message });
  }

  const { code } = await authenticateResponse.json();

  const tokenUrl = new URL('token', authBaseUrl);
  tokenUrl.searchParams.set('code', code);
  tokenUrl.searchParams.set('verifier', verifier);
  const tokenResponse = await fetch(tokenUrl.href, {
    method: 'get',
  });

  if (!tokenResponse.ok) {
    const {
      error: { message },
    } = await authenticateResponse.json();
    throw createError({ status: 400, message });
  }

  const { auth_token: authToken } = await tokenResponse.json();

  setCookie(event, 'edgedb-auth-token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return { redirect: '/' };
});
