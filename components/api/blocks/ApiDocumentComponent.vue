<template>
  <div class="api-document-component q-my-md">
    <q-card flat bordered class="document-card">
      <q-card-section class="document-header row items-center">
        <div class="col">
          <div class="text-h6 document-title">
            {{ documentTitle }}
          </div>
          <div class="text-caption text-grey document-info" v-if="documentInfo">
            {{ documentInfo }}
          </div>
        </div>
        <q-btn 
          v-if="documentUrl" 
          :href="documentUrl" 
          target="_blank"
          color="primary" 
          class="download-button"
          icon="download" 
          flat 
          round
        />
      </q-card-section>
      
      <q-separator />
      
      <q-card-section class="document-details row items-center">
        <div class="col">
          <div class="row items-center">
            <q-icon 
              :name="getFileIcon()" 
              size="2rem" 
              color="grey-7" 
              class="q-mr-md"
            />
            <div>
              <div class="text-subtitle1">{{ documentFileName }}</div>
              <div class="text-caption text-grey-7">
                {{ documentFileSize }}
                <span v-if="documentExtension" class="file-extension">{{ documentExtension }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <q-btn 
          v-if="documentUrl"
          :href="documentUrl" 
          target="_blank"
          color="primary" 
          outline
          class="q-px-md"
          no-caps
        >
          Descargar
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

// Propiedades del componente
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: API_BASE_URL
  }
});

// Título del documento
const documentTitle = computed(() => {
  return props.block?.value?.titulo || 'Documento';
});

// Información del documento (metadatos)
const documentInfo = computed(() => {
  const documento = props.block?.value?.documento;
  if (!documento) return '';
  
  const parts = [];
  if (documento.file_extension) parts.push(documento.file_extension.toUpperCase());
  if (documento.file_size) {
    const size = formatFileSize(documento.file_size);
    if (size) parts.push(size);
  }
  
  return parts.join(' • ');
});

// URL del documento (proxied para evitar CORS)
const documentUrl = computed(() => {
  const documento = props.block?.value?.documento;
  if (!documento || !documento.url) return null;
  
  // Si es una ruta relativa, añadir la URL base
  if (documento.url.startsWith('/')) {
    return `/api/proxy-file?url=${encodeURIComponent(props.apiBaseUrl + documento.url)}`;
  } else if (documento.url.startsWith('http')) {
    return `/api/proxy-file?url=${encodeURIComponent(documento.url)}`;
  }
  
  return documento.url;
});

// Nombre del archivo
const documentFileName = computed(() => {
  const documento = props.block?.value?.documento;
  return documento?.filename || documento?.title || 'archivo';
});

// Tamaño del archivo formateado
const documentFileSize = computed(() => {
  const documento = props.block?.value?.documento;
  if (!documento?.file_size) return '';
  
  return formatFileSize(documento.file_size);
});

// Extensión del archivo
const documentExtension = computed(() => {
  const documento = props.block?.value?.documento;
  return documento?.file_extension ? `.${documento.file_extension}` : '';
});

// Formatear el tamaño del archivo
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// Obtener el icono adecuado según el tipo de archivo
function getFileIcon() {
  const extension = props.block?.value?.documento?.file_extension?.toLowerCase();
  
  if (!extension) return 'insert_drive_file';
  
  // Mapeo de extensiones a iconos
  const iconMap = {
    'pdf': 'picture_as_pdf',
    'doc': 'description',
    'docx': 'description',
    'xls': 'table_view',
    'xlsx': 'table_view',
    'ppt': 'slideshow',
    'pptx': 'slideshow',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    'zip': 'folder_zip',
    'rar': 'folder_zip',
    'csv': 'table_view'
  };
  
  return iconMap[extension] || 'insert_drive_file';
}
</script>

<style scoped>
.api-document-component {
  max-width: 800px;
  margin: 0 auto;
}

.document-card {
  transition: all 0.3s ease;
}

.document-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.document-header {
  background-color: #f9f9f9;
}

.download-button {
  transition: transform 0.2s ease;
}

.download-button:hover {
  transform: translateY(-2px);
}

.file-extension {
  opacity: 0.7;
}
</style>
