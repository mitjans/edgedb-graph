<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const { user } = useUser();

const logout = async () => {
  await $fetch('/auth/logout', { method: 'POST' });
  user.value = null;
  await navigateTo('/');
};
</script>

<template>
  <div>
    Hello Dashboard
    <div v-if="user !== null">
      <span>Current user id: {{ user.id }}</span>
      <button @click="logout()">Logout</button>
    </div>
  </div>
</template>
