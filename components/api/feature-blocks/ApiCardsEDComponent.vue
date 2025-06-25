<template>
  
  <section class="q-pa-sm q-py-md">
    <div class="row q-col-gutter-md justify-center q-mx-auto" style="max-width: 900px;">
      <div 
        v-for="(tarjeta, index) in tarjetas" 
        :key="index" 
        class="col-12 col-sm-12 col-md-5 q-mb-md"
      >
        <!-- Usando componente ModuloTarjeta con clases de Quasar -->
        <ModuloTarjeta
          :titulo="tarjeta.titulo"
          :contenido="tarjeta.descripcion"
          :accion-primaria="tarjeta.enlace?.text || ''"
          :ruta-accion-primaria="formatEnlace(tarjeta.enlace?.url) || '#'"
          :color-accion-primaria="tarjeta.enlace?.style || 'primary'"
          :efecto-hover="false"
          :borde="true"
          tarjeta-clase="h-100 q-pa-none"
        >
          <template v-slot:contenido-personalizado>
            <!-- Lista de textos adicionales con Quasar -->
            <q-list 
              v-if="tarjeta.textos_adicionales && tarjeta.textos_adicionales.length" 
              padding 
              class="q-mt-md rounded-borders bg-grey-1"
              style="min-height: 180px"
            >
              <div 
                v-for="(texto, idx) in tarjeta.textos_adicionales" 
                :key="idx" 
                class="flex q-py-sm"
                style="border-bottom: 1px solid rgba(0,0,0,0.05)"
              >
                <q-icon 
                  name="check_circle" 
                  color="accent" 
                  size="xs" 
                  class="q-mr-sm"
                />
                <div 
                  class="text-body2" 
                  v-html="texto"
                ></div>
              </div>
            </q-list>
          </template>
        </ModuloTarjeta>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import ModuloTarjeta from '../shared/ModuloTarjeta.vue';
// Usando useRuntimeConfig de Nuxt en lugar de una constante importada

// Props para recibir datos de la API
const props = defineProps({
  // Datos de las tarjetas
  block: {
    type: Object,
    required: true,
    default: () => ({
      type: 'cardsED',
      value: {
        tarjetas: []
      },
      id: ''
    })
  },
  apiBaseUrl: {
    type: String,
    default: ''
  }
});

// Extraer las tarjetas del bloque
const tarjetas = computed(() => {
  if (!props.block || !props.block.value || !props.block.value.tarjetas) {
    // console.warn('El bloque no contiene tarjetas o tiene un formato incorrecto');
    return [];
  }
  return props.block.value.tarjetas;
});

// Función para procesar URLs de imágenes
const processImageUrl = (url) => {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  } else {
    // Usar proxy para evitar problemas de CORS
    const config = useRuntimeConfig();
    return `/api/proxy-image?url=${encodeURIComponent(config.public.apiBase + url)}`;
  }
};

// Función para obtener la URL completa de la imagen
const getImageUrl = (imagen) => {
  if (!imagen) return '';
  return processImageUrl(imagen.url);
};

// URL de la imagen de fondo del encabezado
const headerImageUrl = computed(() => {
  // Si el bloque tiene una imagen de fondo, la usamos
  if (props.block?.value?.imagen_fondo?.url) {
    return processImageUrl(props.block.value.imagen_fondo.url);
  }
  // Si no, usamos una imagen por defecto
  const config = useRuntimeConfig();
  return `/api/proxy-image?url=${encodeURIComponent(config.public.apiBase + '/media/images/pacto-verde-bg.jpg')}`;
});

// Función para formatear enlaces correctamente
const formatEnlace = (url) => {
  if (!url) return '#';
  
  // Si la URL ya es absoluta (comienza con http), la devolvemos tal cual
  if (url.startsWith('http')) {
    // Extraer solo la ruta relativa si es una URL local
    const localUrlPattern = /(localhost|127\.0\.0\.1):\d+(\/[^\s]*)/;
    const match = url.match(localUrlPattern);
    if (match && match[2]) {
      return match[2]; // Devolver solo la parte de la ruta
    }
    return url;
  }
  
  // Si es una ruta relativa, la devolvemos tal cual
  return url;
};
</script>
