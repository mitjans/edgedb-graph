<script setup lang="ts">
import { Graph, FunctionPlot } from '@ksassnowski/vueclid';
import { compile } from 'mathjs';

const { expression, scale = 1 } = defineProps<{
  expression: string;
  favorite: boolean;
  scale?: number;
}>();

const callback = computed(() => {
  return (x: number) => compile(expression).evaluate({ x }) as number;
});
</script>

<template>
  <div
    class="flex cursor-pointer flex-col items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,.1)] outline outline-1 outline-gray-200 transition duration-300 hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,.12)]"
  >
    <div class="flex w-full items-center gap-2">
      <pre class="grow rounded-lg bg-gray-100 px-4 py-2 text-center font-mono">{{ expression }}</pre>
      <Icon :name="favorite ? 'ph:star-fill' : 'ph:star'" />
    </div>

    <Graph
      :width="scale * 200"
      :height="scale * 200"
      :padding="0"
      :domain-y="[-6, 6]"
      :domain-x="[-6, 6]"
      :units="false"
    >
      <FunctionPlot :key="callback" :function="callback" :line-width="2" />
    </Graph>
  </div>
</template>
