// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@unocss/nuxt'
  ],

  css: ['@unocss/reset/tailwind-compat.css']
})
