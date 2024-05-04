import * as v from 'valibot';
import { createClient } from 'edgedb';
import { getSimilarFunctions } from '~/dbschema/queries';

const bodySchema = v.object({
  query: v.array(v.number()),
});

export default defineEventHandler(async (event) => {
  const { query } = await readValidatedBody(event, (data) => v.parse(bodySchema, data));

  const client = createClient();
  const result = await getSimilarFunctions(client, { query });

  return {
    result,
  };
});
