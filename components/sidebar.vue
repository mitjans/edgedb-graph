<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const show = defineModel<boolean>('show', { required: true });
const { dismissable = true } = defineProps<{
  dismissable?: boolean;
}>();

const modal = ref<HTMLDivElement>();
onClickOutside(modal, () => (show.value = !dismissable));
onKeyStroke('Escape', () => (show.value = !dismissable));

watch(show, async () => {
  if (!show.value) return;

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
});
</script>

<template>
  <Teleport to="body">
    <Transition
      name="nested"
      :duration="{
        enter: 350,
        leave: 0,
      }"
    >
      <div
        v-if="show"
        ref="modal"
        :class="$attrs.class"
        class="fixed inset-y-1/2 z-20 my-4 ml-4 flex h-3/4 -translate-y-1/2 flex-col gap-10 overflow-y-auto rounded-2xl border-2 border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="css">
.nested-enter-active,
.nested-leave-active {
  transition: opacity 300ms ease-in-out;
}

.nested-enter-active,
.nested-leave-active {
  transition: all 200ms ease-in-out;
}

.nested-enter-active {
  transition-delay: 150ms;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateX(-100%) translateY(-50%);
  opacity: 0;
}
</style>
