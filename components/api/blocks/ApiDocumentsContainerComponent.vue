<template>
  <div class="api-documents-container q-my-xl">
    <div class="container-xl q-mx-auto">
      <h3 v-if="title" class="documents-section-title text-certiffy-azul q-mb-md" style="font-family: 'OpenSans-Bold', sans-serif;">
        {{ title }}
      </h3>
      
      <div class="documents-grid">
        <div 
          v-for="(document, index) in documents" 
          :key="document.id || index"
          class="document-item"
        >
          <ApiDocumentComponent 
            :block="document" 
            :apiBaseUrl="apiBaseUrl"
          />
        </div>
      </div>
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

<style scoped>
.api-documents-container {
  margin: 2rem 0;
}

.documents-section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.documents-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.document-item {
  flex: 0 0 auto;
  width: 300px;
  max-width: 100%;
}

/* Estilos para dispositivos móviles */
@media (max-width: 767px) {
  .documents-grid {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 20px;
  }
  
  .document-item {
    scroll-snap-align: start;
    width: 85%;
  }
}
</style>
