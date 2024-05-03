import { createClient } from 'edgedb';
import { getSimilarFunctions } from '~/dbschema/queries';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const client = createClient();
  const result = await getSimilarFunctions(client, { query: await JSON.parse(body) });

  return {
    status: 200,
    body: result,
  };
});
