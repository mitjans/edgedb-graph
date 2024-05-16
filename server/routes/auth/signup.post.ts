import * as v from 'valibot';

const bodySchema = v.object({
  provider: v.string(),
  email: v.string([v.email()]),
  password: v.string([v.notLength(0)]),
});

export default defineEventHandler(async (event) => {
  const { email, password, provider } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));
  const { challenge, verifier } = generatePKCE();

  const {
    edgedb: { authBaseUrl },
  } = useRuntimeConfig();

  const { origin } = getRequestURL(event);
  const registerUrl = new URL('register', authBaseUrl);
  const registerResponse = await fetch(registerUrl.href, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge,
      email,
      password,
      provider,
      verify_url: `${origin}/auth/verify`,
    }),
  });

  if (!registerResponse.ok) {
    const {
      error: { message },
    } = await registerResponse.json();
    throw createError({ status: 400, message });
  }

  setCookie(event, 'edgedb-pkce-verifier', verifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
});
