<template>
  <div class="api-document-component q-my-lg">
    <div class="document-container">
      <q-card flat bordered class="document-card bg-white shadow-1">
        <q-card-section class="document-header">
          <div class="text-h6 document-title text-certiffy-azul" style="font-family: 'OpenSans-Bold', sans-serif;">
            {{ documentTitle }}
          </div>
          <div class="text-caption text-grey-7 document-info" v-if="documentInfo">
            {{ documentInfo }}
          </div>
        </q-card-section>
        
        <q-card-section class="document-details">
          <div class="row items-center">
            <q-icon 
              :name="getFileIcon()" 
              size="1.8rem" 
              color="grey-7" 
              class="q-mr-sm"
            />
            <div class="file-info">
              <div class="file-name text-subtitle2" style="font-family: 'OpenSans-SemiBold', sans-serif;">{{ documentFileName }}</div>
              <div class="text-caption text-grey-7">
                {{ documentFileSize }}
              </div>
            </div>
          </div>
          
          <q-btn 
            v-if="documentUrl"
            :href="documentUrl" 
            target="_blank"
            color="certiffy-verde" 
            class="q-px-md q-mt-sm download-btn hover-effect"
            no-caps
            rounded
            outline
            size="sm"
          >
            Descargar
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
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
  max-width: 100%;
  margin: 0 auto;
}

.document-container {
  max-width: 500px;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.document-card {
  transition: all 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.document-card:hover {
  box-shadow: 0 5px 15px rgba(10, 26, 66, 0.1);
  transform: translateY(-2px);
}

.document-header {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.document-title {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.3;
  margin-bottom: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.document-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
}

.file-info {
  flex: 1;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.download-btn {
  align-self: flex-start;
  transition: all 0.3s ease;
  font-family: 'OpenSans-SemiBold', sans-serif;
}

.download-btn:hover {
  background-color: rgba(61, 178, 73, 0.1);
  transform: translateY(-1px);
}

/* Media queries para ajustar al diseño horizontal */
@media (min-width: 768px) {
  .api-document-component {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    max-width: 32%;
  }
  
  .document-container {
    height: 100%;
  }
  
  .document-card {
    height: 100%;
  }
}
</style>
