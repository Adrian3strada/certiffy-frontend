<template>
  <section class="q-pa-md">
    <div class="row q-col-gutter-md q-col-gutter-lg-xl justify-center" style="max-width: 1200px; margin: 0 auto;">
      <div 
        v-for="(tarjeta, index) in tarjetas" 
        :key="index" 
        class="col-12 col-sm-12 col-md-6 col-lg-4 q-mb-md"
      >
        <ModuloTarjeta
          :titulo="tarjeta.titulo"
          :contenido="tarjeta.descripcion"
          :accion-primaria="tarjeta.enlace?.text || ''"
          :ruta-accion-primaria="tarjeta.enlace?.url || '#'"
          :color-accion-primaria="tarjeta.enlace?.style || 'primary'"
          :efecto-hover="true"
          :borde="true"
          tarjeta-clase="h-100 q-hoverable"
        >
          <template v-slot:contenido-personalizado>
            <q-list v-if="tarjeta.textos_adicionales && tarjeta.textos_adicionales.length" padding separator class="q-mt-md rounded-borders">
              <q-item v-for="(texto, idx) in tarjeta.textos_adicionales" :key="idx" clickable class="q-hoverable" :class="{'q-py-sm': $q.screen.lt.sm}">
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" :size="$q.screen.lt.sm ? 'xs' : 'sm'" class="q-mr-sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label :class="{'text-caption': $q.screen.lt.sm, 'text-body2': !$q.screen.lt.sm}" v-html="texto"></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </ModuloTarjeta>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModuloTarjeta from '../shared/ModuloTarjeta.vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

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
    console.warn('El bloque no contiene tarjetas o tiene un formato incorrecto');
    return [];
  }
  return props.block.value.tarjetas;
});

// Función para procesar URLs de imágenes si las tuviéramos en el futuro
const processImageUrl = (url) => {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  } else {
    // Usar proxy para evitar problemas de CORS
    const baseUrl = props.apiBaseUrl || API_BASE_URL;
    return `/api/proxy-image?url=${encodeURIComponent(baseUrl + url)}`;
  }
};
</script>


