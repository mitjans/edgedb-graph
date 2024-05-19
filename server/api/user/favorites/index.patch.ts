import { createClient } from 'edgedb';
import e from '~/dbschema/edgeql-js';
import * as v from 'valibot';

const bodySchema = v.object({
  id: v.string([v.uuid()]),
  favorite: v.boolean(),
});

export default defineEventHandler(async (event) => {
  const { id, favorite } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));

  const authToken = getCookie(event, 'edgedb-auth-token');
  const client = createClient().withGlobals({
    'ext::auth::client_token': authToken,
  });

  let query;
  if (favorite) {
    query = {
      '+=': e.select(e.Function, () => ({ filter_single: { id } })),
    };
  } else {
    query = {
      '-=': e.select(e.Function, () => ({ filter_single: { id } })),
    };
  }

  await e
    .update(e.User, () => ({
      set: {
        favorites: query,
      },
      filter_single: { id: e.global.current_user.id },
    }))
    .run(client);
});
