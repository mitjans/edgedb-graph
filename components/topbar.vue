<script setup lang="ts">
const { user } = useUser();
const showLoginModal = ref(false);

const logout = async () => {
  await $fetch('/auth/logout', { method: 'POST' });
  user.value = null;
  await navigateTo('/', { external: true });
};
</script>

<template>
  <Modal v-model:show="showLoginModal" class="w-96" title="Sign in or Sign up">
    <Signin />
  </Modal>

  <div class="flex flex-row-reverse p-6">
    <button
      v-if="user"
      type="submit"
      class="flex items-center gap-2 rounded-md border-2 border-red-400 px-3 py-1 text-red-400 outline-none transition hover:border-red-500 hover:shadow-[0_2px_10px_rgba(0,0,0,.1)] focus:border-red-500 focus:shadow-[0_2px_10px_rgba(0,0,0,.1)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
      @click="logout"
    >
      Logout
      <Icon name="ph:sign-out" />
    </button>
    <button
      v-else
      type="submit"
      class="flex items-center gap-2 rounded-md border-2 border-emerald-400 px-3 py-1 text-emerald-400 outline-none transition hover:border-emerald-500 hover:shadow-[0_2px_10px_rgba(0,0,0,.1)] focus:border-emerald-500 focus:shadow-[0_2px_10px_rgba(0,0,0,.1)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
      @click="showLoginModal = true"
    >
      Login
      <Icon name="ph:sign-in" />
    </button>
  </div>
</template>
