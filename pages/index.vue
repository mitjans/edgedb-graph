<script setup lang="ts">
const query = ref<string>('');
const result = ref<string>('');
const { fetchEmbedding, key } = useOpenAi();

const submit = async () => {
  if (!key.value) {
    alert('Please enter an OpenAI API key');
    return;
  } else if (!query.value) {
    alert('Please enter a query');
    return;
  }

  const queryEmbedding = await fetchEmbedding(query.value);

  const { result: searchResults } = await $fetch('/api/search', {
    method: 'POST',
    body: { query: queryEmbedding },
  });

  result.value = JSON.stringify(searchResults, null, 2);
};

const mounted = ref(false);
const show = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <Modal v-model:show="show" class="w-96" title="Enter OpenAI API key">
    <div class="flex flex-col gap-2">
      <input v-model="key" type="password" class="rounded-md border px-4 py-2" placeholder="sk-proj-..." />
      <span class="ml-2 text-xs text-neutral-400">
        The key will be only stored locally in your device and <b>never</b> sent to any server
      </span>
    </div>
  </Modal>

  <div class="item-center flex min-h-screen flex-col">
    <Topbar />

    <form class="mx-auto mt-40 flex w-full max-w-96 items-start gap-4" @submit.prevent>
      <div class="flex flex-col items-start gap-1">
        <input
          v-model="query"
          type="text"
          :class="[
            'relative w-full rounded-xl border-2 px-6 py-3 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition focus:border-neutral-300 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)]',
            mounted && key.length === 0 && 'border-red-400 focus:border-red-400',
          ]"
          placeholder="x^2 + 10"
        />

        <button
          v-if="mounted && key.length === 0"
          class="ml-2 text-xs text-red-400 underline underline-offset-2"
          @click="show = true"
        >
          OpenAI API key missing
        </button>
      </div>

      <button
        type="submit"
        class="rounded-xl bg-emerald-400 px-6 py-3 text-neutral-50 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:bg-emerald-500 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:bg-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
        :disabled="query.length === 0 || key === null"
        @click="submit"
      >
        Send
      </button>
    </form>
  </div>
</template>
