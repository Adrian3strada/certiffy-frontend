// Plugin para proporcionar un helper de useFetch para composables
import { defineNuxtPlugin, useFetch } from '#app';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      apiFetch: async (url, options) => {
        return useFetch(url, options);
      }
    }
  };
});
