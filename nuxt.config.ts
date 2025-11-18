// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: "static",
  },
  typescript: {
    strict: true,
  },
  compatibilityDate: "2025-11-18",
  devtools: { enabled: true },
});
