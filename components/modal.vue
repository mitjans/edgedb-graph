<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const show = defineModel<boolean>('show', { required: true });
const { title, dismissable = true } = defineProps<{
  title?: string;
  dismissable?: boolean;
}>();

const modal = ref<HTMLDivElement>();
onClickOutside(modal, () => (show.value = !dismissable));
onKeyStroke('Escape', () => (show.value = !dismissable));
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
      <div v-if="show" class="fixed inset-0 z-20 grid place-items-center bg-black/5 backdrop-blur-md">
        <div ref="modal" :class="$attrs.class" class="overlay flex flex-col gap-10 rounded-2xl border-2 bg-white p-6">
          <div class="flex w-full flex-row-reverse items-center justify-between">
            <button @click="show = false">
              <Icon name="ph:x" />
            </button>
            <span v-if="title" class="text-xl">{{ title }}</span>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="css">
.nested-enter-active,
.nested-leave-active {
  transition: opacity 300ms ease-in-out;
}

.nested-enter-from,
.nested-leave-to {
  opacity: 0;
}

.nested-enter-active .overlay,
.nested-leave-active .overlay {
  transition: all 200ms ease-in-out;
}

.nested-enter-active .overlay {
  transition-delay: 150ms;
}

.nested-enter-from .overlay,
.nested-leave-to .overlay {
  transform: scale(0.9);
  opacity: 0;
}
</style>
