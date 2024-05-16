// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-icon', '@vueuse/nuxt', '@nuxt/eslint', '@nuxt/fonts', '@nuxtjs/tailwindcss'],
  vue: { propsDestructure: true },
  runtimeConfig: {
    edgedb: {
      authBaseUrl: '',
    },
  },
});
