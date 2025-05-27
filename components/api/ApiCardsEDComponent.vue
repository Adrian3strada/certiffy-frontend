<template>
  <section class="cards-ed-component q-pa-md">
    <div class="row q-col-gutter-md q-col-gutter-lg-xl justify-center">
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
          tarjeta-clase="card-ed h-100"
        >
          <template v-slot:contenido-personalizado>
            <q-list v-if="tarjeta.textos_adicionales && tarjeta.textos_adicionales.length" padding separator class="feature-list">
              <q-item v-for="(texto, idx) in tarjeta.textos_adicionales" :key="idx" class="feature-item">
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" size="sm" class="feature-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="feature-text" v-html="texto"></q-item-label>
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
import ModuloTarjeta from '../certiffy/base/ModuloTarjeta.vue';
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

<style scoped>
.cards-ed-component {
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
}

.feature-list {
  margin-top: 1rem;
  border-radius: 4px;
}

.feature-item {
  min-height: 48px;
  transition: background-color 0.2s ease;
}

.feature-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.feature-icon {
  margin-right: 8px;
}

.feature-text {
  font-size: 0.95rem;
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .feature-text {
    font-size: 0.9rem !important;
  }
  
  .feature-item {
    min-height: 40px !important;
    padding: 8px 0 !important;
  }
  
  .feature-icon {
    font-size: 1rem !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .feature-text {
    font-size: 0.92rem !important;
  }
  
  .feature-item {
    min-height: 44px !important;
  }
}
</style>
