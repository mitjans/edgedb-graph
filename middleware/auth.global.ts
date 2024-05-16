export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) return;

  const response = await $fetch('/api/user/me', {
    ignoreResponseError: true,
    headers: useRequestHeaders(['cookie']),
  });

  const { user } = useUser();
  user.value = response.user;
});
