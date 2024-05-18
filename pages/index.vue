<script setup lang="ts">
import { Graph, FunctionPlot } from '@ksassnowski/vueclid';
import { compile } from 'mathjs';

const query = ref<string>('');
const submittedQuery = ref<string>('');
const result = ref<{ id: string; expression: string; distance: number }[]>([]);
const { fetchEmbedding, key } = useOpenAi();

function createCallback(expressionToComplie: string): (x: number) => number {
  return (x: number) => compile(expressionToComplie).evaluate({ x });
}

const resultsCallback = computed(() => result.value.map(({ expression }) => createCallback(expression)));
const expressionCallback = ref<(x: number) => number>();

const submit = async () => {
  if (!key.value) {
    alert('Please enter an OpenAI API key');
    return;
  } else if (!query.value) {
    alert('Please enter a query');
    return;
  }

  expressionCallback.value = createCallback(query.value);

  searching.value = true;
  submittedQuery.value = query.value;

  const queryEmbedding = await fetchEmbedding(query.value);

  const { result: searchResults } = await $fetch('/api/search', {
    method: 'POST',
    body: { query: queryEmbedding },
  });

  result.value = searchResults;

  searching.value = false;
};

const mounted = ref(false);
const show = ref(false);
const searching = ref(false);

onMounted(() => {
  mounted.value = true;
});

async function setQueryAndSubmit(expression: string) {
  query.value = expression;
  await submit();
}
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

    <form class="mx-auto mb-8 flex w-full max-w-96 items-start gap-4" @submit.prevent>
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
        class="flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-neutral-50 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline-none transition hover:bg-emerald-500 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)] focus:bg-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.12)] disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:shadow-none"
        :disabled="query.length === 0 || key === null"
        @click="submit"
      >
        <span>Send</span>

        <Icon
          size="18"
          :name="searching ? 'ph:spinner' : 'ph:arrow-circle-right-fill'"
          :class="searching && 'animate-spin'"
        />
      </button>
    </form>

    <ClientOnly v-if="expressionCallback">
      <div class="flex flex-col items-center">
        <span>{{ submittedQuery }}</span>
        <Graph :domain-y="[-2, 2]" :domain-x="[-6, 6]">
          <FunctionPlot
            v-if="expressionCallback"
            :key="expressionCallback"
            :function="expressionCallback"
            :line-width="2"
          />
        </Graph>
      </div>

      <section v-if="result.length > 0" class="flex">
        <div
          v-for="(callback, index) in resultsCallback"
          :key="callback"
          class="flex cursor-pointer flex-col items-center"
          @click="setQueryAndSubmit(result[index].expression)"
        >
          <span>{{ result.at(index)?.expression }}</span>
          <Graph :key="callback" :domain-y="[-2, 2]" :domain-x="[-6, 6]">
            <FunctionPlot v-if="callback" :key="callback" :function="callback" :line-width="2" />
          </Graph>
        </div>
      </section>
    </ClientOnly>
  </div>
</template>
