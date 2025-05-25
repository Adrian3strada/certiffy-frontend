<template>
  <section class="api-card-component q-py-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Contenedor de tarjetas -->
      <div class="row q-col-gutter-md justify-center">
        <!-- Tarjetas dinámicas (más alargadas) -->
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          :class="[
            'col-12',
            cards.length === 1 ? 'col-sm-10 col-md-4' : 'col-sm-4 col-md-4'
          ]"
        >
          <q-card 
            class="card-item full-height my-card elevation-3"
            :class="card.estilo ? `custom-card-${card.estilo}` : 'custom-card-default'"
            bordered
          >
            <!-- Imagen (ahora ocupa todo el ancho) -->
            <div class="card-image-container">
              <q-img
                v-if="card.imagen && card.imagen.url"
                :src="`/api/proxy-image?url=${encodeURIComponent(card.imagen.url)}`"
                class="card-image"
                :ratio="1"
                fit="cover"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="image" size="3rem" color="grey-7" />
                  </div>
                </template>
              </q-img>
              <div v-else class="placeholder-image flex flex-center">
                <q-icon name="image" size="3rem" color="grey-6" />
              </div>
            </div>

            <!-- Contenido de la tarjeta -->
            <q-card-section class="q-pa-md">
              <div class="text-weight-bold card-title q-mb-sm" 
                   :class="`text-${getTitleColor(card.estilo)}`">
                {{ card.titulo }}
              </div>
              <p class="card-description ellipsis-3-lines">
                {{ card.descripcion }}
              </p>
              
              <q-btn
                v-if="card.enlace"
                :color="getButtonColor(card.estilo)"
                flat
                class="q-mt-sm q-px-none"
                :to="card.enlace"
                :href="isExternalLink(card.enlace) ? card.enlace : undefined"
                :target="isExternalLink(card.enlace) ? '_blank' : undefined"
                icon-right="arrow_forward"
                padding="none"
                dense
                no-caps
              >
                Ver más
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const props = defineProps({
  block: { type: Object, required: true },
  apiBaseUrl: { type: String, default: API_BASE_URL }
});

// Extraer las tarjetas del bloque
const cards = computed(() => 
  props.block?.value?.tarjetas || []
);

// Funciones de utilidad simplificadas
function isExternalLink(url) {
  return url?.startsWith('http') || url?.startsWith('//');
}

function getTitleColor(style) {
  return {
    'primary': 'dark',
    'secondary': 'white',
    'dark': 'white',
    'warning': 'dark',
    'negative': 'white',
    'info': 'white',
    'accent': 'white'
  }[style] || 'dark';
}

function getButtonColor(style) {
  return style || 'primary';
}
</script>

<style scoped>
.api-card-component .card-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  height: auto;
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}

/* Estilos personalizados para las tarjetas */
.api-card-component .custom-card-default {
  background-color: white;
  border-top: 4px solid var(--q-primary);
}

.api-card-component .custom-card-primary {
  background-color: var(--q-blue-1);
  border-top: 4px solid var(--q-primary);
}

.api-card-component .custom-card-secondary {
  background-color: var(--q-green-1);
  border-top: 4px solid var(--q-secondary);
}

.api-card-component .custom-card-warning {
  background-color: var(--q-amber-1);
  border-top: 4px solid var(--q-warning);
}

.api-card-component .custom-card-negative {
  background-color: var(--q-red-1);
  border-top: 4px solid var(--q-negative);
}

.api-card-component .custom-card-info {
  background-color: var(--q-cyan-1);
  border-top: 4px solid var(--q-info);
}

.api-card-component .custom-card-dark {
  background-color: var(--q-grey-2);
  border-top: 4px solid var(--q-dark);
}

.api-card-component .card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.api-card-component .card-image-container {
  overflow: hidden;
  width: 100%;
}

.api-card-component .placeholder-image {
  height: 240px;
  background-color: var(--q-grey-2);
}

.api-card-component .card-title {
  font-size: 1rem;
  line-height: 1.3;
  text-transform: uppercase;
  font-weight: bold;
}

.api-card-component .card-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--q-grey-8);
  margin-bottom: 8px;
}

/* Clases para limitar líneas de texto */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilos responsivos */
@media (max-width: 599px) {
  .api-card-component .card-item {
    max-width: 100%;
  }
  
  .api-card-component .card-image-container {
    height: auto;
  }
  
  .api-card-component .card-title {
    font-size: 0.9rem;
  }
  
  .api-card-component .card-description {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
  }
}
</style>
