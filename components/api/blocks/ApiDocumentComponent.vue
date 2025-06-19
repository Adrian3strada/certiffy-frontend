<template>
  <div class="q-py-md q-px-sm">
    <div class="q-pa-sm" style="max-width: 500px">
      <q-card flat bordered class="q-hoverable" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-card-section class="q-pb-xs q-mb-xs" :class="$q.dark.isActive ? 'doc-header-dark' : 'doc-header-light'">
          <div class="text-subtitle1 text-weight-bold text-primary ellipsis">
            {{ documentTitle }}
          </div>
          <div class="text-caption text-grey-7" v-if="documentInfo">
            {{ documentInfo }}
          </div>
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <div class="row items-center">
            <q-icon 
              :name="getFileIcon()" 
              size="1.8rem" 
              color="grey-7" 
              class="q-mr-sm"
            />
            <div class="col">
              <div class="text-body2 text-weight-medium ellipsis" style="max-width: 200px">
                {{ documentFileName }}
              </div>
              <div class="text-caption text-grey-7">
                {{ documentFileSize }}
              </div>
            </div>
          </div>
          
          <q-btn 
            v-if="documentUrl"
            :href="documentUrl" 
            target="_blank"
            color="secondary" 
            class="q-mt-sm q-px-md"
            no-caps
            rounded
            outline
            size="sm"
            :ripple="{early: true, color: 'secondary'}"
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
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

// NOTA: Ya no importamos CSS externo, usando clases de Quasar

// Propiedades del componente
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase // Use factory function for default
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

<style>
/* Estilos mínimos necesarios que no tienen equivalente en Quasar */
.doc-header-light {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.doc-header-dark {
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

/* Añadimos soporte para tema oscuro en la tarjeta */
.q-card.bg-dark {
  background-color: #1d1d1d;
}
</style>
