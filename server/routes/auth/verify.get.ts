import * as v from 'valibot';
import e from '~/dbschema/edgeql-js';
import { createClient } from 'edgedb';

const querySchema = v.object({
  verification_token: v.string(),
});

export default defineEventHandler(async (event) => {
  const { verification_token: token } = await getValidatedQuery(event, (data) => v.parse(querySchema, data));

  const verifier = getCookie(event, 'edgedb-pkce-verifier');

  if (verifier === undefined) {
    throw createError({ status: 400 });
  }

  const {
    edgedb: { authBaseUrl },
  } = useRuntimeConfig();

  const verifyUrl = new URL('verify', authBaseUrl);
  const verifyResponse = await fetch(verifyUrl.href, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      verification_token: token,
      verifier,
      provider: 'builtin::local_emailpassword',
    }),
  });

  if (!verifyResponse.ok) {
    throw createError({ status: 400 });
  }

  const { code } = await verifyResponse.json();

  const tokenUrl = new URL('token', authBaseUrl);
  tokenUrl.searchParams.set('code', code);
  tokenUrl.searchParams.set('verifier', verifier);
  const tokenResponse = await fetch(tokenUrl.href);

  if (!tokenResponse.ok) {
    throw createError({ status: 400 });
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

  deleteCookie(event, 'edgedb-pkce-verifier');
  setCookie(event, 'edgedb-auth-token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  sendRedirect(event, '/');
});
