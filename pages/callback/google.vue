<script setup lang="ts">
const { query } = useRoute();
const { code } = query;

const validate = async () => {
  const { redirect } = await $fetch('/auth/callback', {
    query: { code },
  });

  await navigateTo(redirect, { external: true });
};

onMounted(validate);
</script>

<template>
  <div>Logging in...</div>
</template>
