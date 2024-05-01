import * as v from 'valibot';
import e from '~/dbschema/edgeql-js';
import { createClient } from 'edgedb';

const bodySchema = v.object({
  email: v.string(),
  password: v.string(),
  provider: v.string(),
});

export default defineEventHandler(async (event) => {
  const { password, provider, email } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));
  const { challenge, verifier } = generatePKCE();

  const {
    edgedb: { authBaseUrl },
  } = useRuntimeConfig();

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
    const message = await authenticateResponse.text();
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
    const message = await authenticateResponse.text();
    throw createError({ status: 400, message });
  }

  const { auth_token: authToken, identity_id: identityId } = await tokenResponse.json();

  const client = createClient();
  await e
    .insert(e.User, {
      identity: e.assert_exists(
        e.select(e.ext.auth.Identity, () => ({
          filter_single: { id: identityId },
        })),
      ),
    })
    .unlessConflict()
    .run(client);

  setCookie(event, 'edgedb-auth-token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
});
