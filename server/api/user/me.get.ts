import { createClient } from 'edgedb';
import e from '~/dbschema/edgeql-js';

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'edgedb-auth-token');

  if (authToken === undefined) {
    throw createError({ status: 401 });
  }

  const client = createClient().withGlobals({
    'ext::auth::client_token': authToken,
  });

  try {
    const user = await e.select(e.global.current_user).assert_single().run(client);
    return { user };
  } catch {
    throw createError({ status: 401 });
  }
});
