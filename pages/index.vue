<script setup lang="ts">
import { compile } from 'mathjs';

const query = ref<string>('');
const submittedQuery = ref<string>('');
const submittedQueryId = ref<string>('');
const submittedQueryFavorite = ref<boolean>(false);
const result = ref<{ id: string; expression: string; distance: number; favorite: boolean }[]>([]);
const { fetchEmbedding, key } = useOpenAi();

function createCallback(expressionToComplie: string): (x: number) => number {
  return (x: number) => compile(expressionToComplie).evaluate({ x });
}

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

  const {
    result: searchResults,
    id,
    favorite,
  } = await $fetch('/api/search', {
    method: 'POST',
    body: { embedding: queryEmbedding, query: query.value },
  });

  submittedQueryId.value = id;
  submittedQueryFavorite.value = favorite;
  result.value = searchResults;

  await nextTick();
  const svgPaths = document.querySelectorAll('path');
  svgPaths.forEach((path) => {
    const d = path.getAttribute('d');
    if (!d || !d.includes('NaN')) return;

    const cleanedSvgPath = d
      // Remove NaN, Infinity, -Infinity
      .replace(/\b\d+(\.\d+)? (NaN|Infinity|-Infinity)[L ]?/g, '')
      // Make extremely small numbers 0
      .replace(/\b-?\d+(\.\d+)?e-\d+\b/g, '0')
      // Clean up M L (svg path start)
      .replace(/^M L\s*/, 'M ')
      .trim();

    path.setAttribute('d', cleanedSvgPath);
  });

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

const { user } = useUser();
const showLoginModal = ref(false);

const toggleFavorite = async (favorite: boolean) => {
  if (!user.value) {
    showLoginModal.value = true;
    return;
  }

  submittedQueryFavorite.value = favorite;

  await $fetch('/api/user/favorites', {
    method: 'PATCH',
    body: { id: submittedQueryId.value, favorite },
  });
};
</script>

<template>
  <Modal v-model:show="show" class="w-96" title="Enter OpenAI API key">
    <div class="flex flex-col gap-2">
      <input v-model="key" type="password" class="rounded-md border px-4 py-2" placeholder="sk-proj-..." />
      <span class="ml-2 text-xs text-zinc-400">
        The key will be only stored locally in your device and <b>never</b> sent to any server
      </span>
    </div>
  </Modal>

  <Modal v-model:show="showLoginModal" class="w-96" title="Sign in or Sign up">
    <Signin />
  </Modal>

  <main class="flex min-h-screen flex-col bg-[#242A31] text-white">
    <Topbar />

    <form class="mx-auto mb-8 flex w-full max-w-96 items-start gap-4" @submit.prevent>
      <div class="flex flex-col items-start gap-1">
        <input
          v-model="query"
          type="text"
          :class="[
            'relative w-full rounded-xl border-2 border-zinc-700 bg-zinc-800 px-6 py-3 shadow-[0_4px_10px_rgba(0,0,0,.03)] outline-none transition focus:border-zinc-600 focus:shadow-[0_6px_20px_rgba(0,0,0,.05)]',
            mounted && key.length === 0 && 'border-red-600 focus:border-red-600',
          ]"
          placeholder="x^2+1"
        />

        <button
          v-if="mounted && key.length === 0"
          class="ml-2 text-xs text-red-600 underline underline-offset-2"
          @click="show = true"
        >
          OpenAI API key missing
        </button>
      </div>

      <button
        type="submit"
        class="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-white shadow-[0_4px_10px_rgba(0,0,0,.03)] outline-none transition hover:bg-emerald-500 focus:bg-emerald-500 focus:shadow-[0_6px_20px_rgba(0,0,0,.05)] disabled:cursor-not-allowed disabled:opacity-80 disabled:shadow-none"
        :disabled="query.length === 0 || key === null || searching"
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

    <div class="flex justify-center">
      <button
        v-if="submittedQuery.length > 0"
        :disabled="searching"
        class="flex items-center rounded-md bg-emerald-400 p-2 text-zinc-50 disabled:opacity-40"
        @click="toggleFavorite(!submittedQueryFavorite)"
      >
        <Icon :name="submittedQueryFavorite ? 'ph:star-fill' : 'ph:star'" size="20" />
      </button>
    </div>

    <ClientOnly v-if="expressionCallback">
      <div class="my-12 flex flex-col items-center">
        <Transition
          appear
          enter-active-class="transition duration-500"
          enter-from-class="opacity-0 scale-50"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-50"
        >
          <Expression
            :key="expressionCallback"
            :scale="1.3"
            :expression="submittedQuery"
            :favorite="submittedQueryFavorite"
          ></Expression>
        </Transition>
      </div>

      <section v-if="result.length > 0" class="relative flex justify-center gap-4">
        <TransitionGroup
          appear
          enter-active-class="transition duration-500"
          enter-from-class="opacity-0 scale-50"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-50"
          move-class="transition duration-500"
        >
          <Expression
            v-for="{ expression, id, favorite } in result"
            :key="id"
            :expression
            :favorite
            @click="setQueryAndSubmit(expression)"
          >
          </Expression>
        </TransitionGroup>
      </section>
    </ClientOnly>

    <div v-else class="mt-9 grid place-items-center text-zinc-100">
      <span class="text-3xl font-black tracking-wide">EdgeDB Graph</span>
      <span>Vector embedding powered function grapher</span>
      <img src="/images/placeholder.webp" alt="Placeholder for function graph" class="h-96 w-96" />
      <span>Enter a mathematical expression to get started</span>
    </div>
  </main>
</template>
