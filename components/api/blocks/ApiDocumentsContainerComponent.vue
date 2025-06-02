<template>
  <div class="api-documents-container q-my-xl">
    <div class="container-xl q-mx-auto">
      <h3 v-if="title" class="documents-section-title text-certiffy-azul q-mb-md" style="font-family: 'OpenSans-Bold', sans-serif;">
        {{ title }}
      </h3>
      
      <div class="documents-list">
        <div 
          v-for="(document, index) in documents" 
          :key="document.id || index"
          class="document-item q-mb-md"
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
  margin: 2rem auto;
  max-width: 800px;
}

.documents-section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--certiffy-azul);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.document-item {
  width: 100%;
  transition: transform 0.3s ease;
}

.document-item:hover {
  transform: translateY(-2px);
}

/* Estilos para dispositivos móviles */
@media (max-width: 767px) {
  .api-documents-container {
    padding: 0 10px;
  }
  
  .document-item {
    margin-bottom: 10px;
  }
}
</style>
