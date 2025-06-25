<template>
  <section :id="'documents-container-' + (id || Math.random().toString(36).substring(2, 9))" class="q-my-md" style="max-width: 800px;">
    <div class="q-px-md">
      <div v-if="title" class="text-h6 text-weight-bold text-primary q-mb-md">
        {{ title }}
      </div>
      
      <q-list padding separator class="q-py-md">
        <q-item 
          v-for="(document, index) in documents" 
          :key="document.id || index"
          class="q-pa-none q-mb-sm"
          v-ripple
        >
          <ApiDocumentComponent 
            :block="document" 
            :apiBaseUrl="apiBaseUrl"
          />
        </q-item>
      </q-list>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import ApiDocumentComponent from './ApiDocumentComponent.vue';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  documents: {
    type: Array,
    default: () => []
  },
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase // Use factory function for default
  }
});

// Computa si hay documentos para mostrar
const hasDocuments = computed(() => {
  return Array.isArray(props.documents) && props.documents.length > 0;
});
</script>

<!-- Eliminamos el import CSS externo y solo usamos clases de Quasar -->
