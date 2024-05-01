export default defineEventHandler(async (event) => {
  deleteCookie(event, 'edgedb-auth-token');
});
