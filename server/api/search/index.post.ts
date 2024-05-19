import { createClient } from 'edgedb';
import e from '~/dbschema/edgeql-js';
import * as v from 'valibot';
import { getSimilarFunctions } from '~/dbschema/queries';

const bodySchema = v.object({
  query: v.string(),
  embedding: v.array(v.number()),
});

export default defineEventHandler(async (event) => {
  const { query, embedding } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));

  const authToken = getCookie(event, 'edgedb-auth-token');
  const client = createClient().withGlobals({
    'ext::auth::client_token': authToken,
  });

  const strippedQuery = query.replaceAll(/\s/g, '');

  const result = await getSimilarFunctions(client, { query: embedding });
  const favorite = await e.op(strippedQuery, 'in', e.global.current_user.favorites.expression).run(client);

  const { id } = await e
    .insert(e.Function, { expression: strippedQuery })
    .unlessConflict((func) => ({
      on: func.expression,
      else: func,
    }))
    .run(client);

  return {
    id,
    favorite,
    result,
  };
});
