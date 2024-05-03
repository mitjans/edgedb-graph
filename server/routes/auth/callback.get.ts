import * as v from 'valibot';
import e from '~/dbschema/edgeql-js';
import { createClient } from 'edgedb';

const querySchema = v.object({
  code: v.string(),
});

export default defineEventHandler(async (event) => {
  const { code } = await getValidatedQuery(event, (data) => v.parse(querySchema, data));

  const {
    edgedb: { authBaseUrl },
  } = useRuntimeConfig();

  const verifier = getCookie(event, 'edgedb-pkce-verifier');

  if (!verifier) {
    throw createError({ status: 400, message: 'Invalid request' });
  }

  const codeExchangeUrl = new URL('token', authBaseUrl);
  codeExchangeUrl.searchParams.set('code', code);
  codeExchangeUrl.searchParams.set('verifier', verifier);
  const codeExchangeResponse = await fetch(codeExchangeUrl.href, {
    method: 'GET',
  });

  if (!codeExchangeResponse.ok) {
    const message = await codeExchangeResponse.text();
    throw createError({ status: 400, message });
  }

  const { auth_token, identity_id: identityId } = await codeExchangeResponse.json();
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

  setCookie(event, 'edgedb-auth-token', auth_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  sendRedirect(event, '/');
});
