export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) return;

  try {
    const response = await $fetch('/api/user/me', {
      headers: useRequestHeaders(['cookie']),
    });
    const { user } = useUser();
    user.value = response.user;
  } catch {
    return navigateTo('/');
  }
});
