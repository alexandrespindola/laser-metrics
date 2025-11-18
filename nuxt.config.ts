// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

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
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
});
