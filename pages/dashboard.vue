<script setup lang="ts">
const { user } = useUser();

const logout = async () => {
  await $fetch('/auth/logout', { method: 'POST' });
  user.value = null;
  await navigateTo('/');
};

const query = ref<string>('');
const result = ref<string>('');
const openaiApiKey = ref<string>();

const submit = async () => {
  if (!openaiApiKey.value) {
    alert('Please enter an OpenAI API key');
    return;
  } else if (!query.value) {
    alert('Please enter a query');
    return;
  }

  const { data } = await $fetch<{ data: { embedding: number[] }[] }>('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiApiKey.value}` },
    body: {
      input: query.value,
      model: 'text-embedding-3-small',
    },
  });

  const queryEmbedding = data[0].embedding;

  const { result: searchResults } = await $fetch('/api/search', {
    method: 'POST',
    body: { query: queryEmbedding },
  });

  result.value = JSON.stringify(searchResults, null, 2);
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

  <form>
    <label>
      OpenAI API Key
      <input v-model="openaiApiKey" type="password" />
    </label>

    <label>
      Query
      <input v-model="query" />
    </label>

    <button @click.prevent="submit()">Submit</button>
  </form>

  <pre>{{ result }}</pre>
</template>
