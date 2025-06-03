<template>
  <div class="q-my-xl" style="max-width: 800px; margin-left: auto; margin-right: auto;">
    <div class="q-mx-auto q-px-sm-none q-px-md">
      <div v-if="title" class="text-h5 text-certiffy-azul q-mb-md text-weight-bold" style="font-family: 'OpenSans-Bold', sans-serif;">
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
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ApiDocumentComponent from './ApiDocumentComponent.vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const props = defineProps({
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
    default: API_BASE_URL
  }
});

// Computa si hay documentos para mostrar
const hasDocuments = computed(() => {
  return Array.isArray(props.documents) && props.documents.length > 0;
});
</script>


