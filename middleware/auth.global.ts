export default defineNuxtRouteMiddleware(async ({ name }) => {
  if (import.meta.client) return;

  try {
    const response = await $fetch('/api/user/me', {
      headers: useRequestHeaders(['cookie']),
    });

    const { user } = useUser();
    user.value = response.user;

    if (name === 'index') return navigateTo('/dashboard');
  } catch {
    if (name !== 'index') return navigateTo('/');
  }
});
