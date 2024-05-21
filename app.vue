<script setup lang="ts">
useHead({
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
      type: 'text/javascript',
    },
  ],
});
</script>

<template>
  <ClientOnly>
    <p>Here is an inline equation: \( x^2 + 2 \).</p>
    <p>Here is a display equation: \[ x^2 + 2 \]</p>
  </ClientOnly>

  <NuxtPage />
</template>
