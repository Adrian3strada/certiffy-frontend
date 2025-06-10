<template>
  <section :id="'documents-container-' + (id || Math.random().toString(36).substring(2, 9))" class="q-my-xl" style="max-width: 800px; margin-left: auto; margin-right: auto;">
    <div class="q-mx-auto q-px-sm-none q-px-md">
      <div v-if="title" class="text-h5 text-primary q-mb-md text-weight-bold" style="font-family: 'OpenSans-Bold', sans-serif;">
        {{ title }}
      </div>
      
      <q-list separator class="q-py-md">
        <q-item 
          v-for="(document, index) in documents" 
          :key="document.id || index"
          class="q-pa-none q-mb-md q-transition"
          style="width: 100%;"
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


