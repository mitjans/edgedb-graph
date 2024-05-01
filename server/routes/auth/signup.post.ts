import * as v from 'valibot';

const bodySchema = v.object({
  email: v.string(),
  password: v.string(),
  provider: v.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password, provider } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));
  const { challenge, verifier } = generatePKCE();

  const {
    edgedb: { authBaseUrl },
  } = useRuntimeConfig();

  const registerUrl = new URL('register', authBaseUrl);
  const registerResponse = await fetch(registerUrl.href, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge,
      email,
      password,
      provider,
      // TODO: Set up verify URL using env variables
      verify_url: `http://localhost:3000/auth/verify`,
    }),
  });

  if (!registerResponse.ok) {
    const message = await registerResponse.text();
    throw createError({ status: 400, message });
  }

  setCookie(event, 'edgedb-pkce-verifier', verifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
});