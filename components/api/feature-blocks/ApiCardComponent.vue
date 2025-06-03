<template>
  <section class="q-py-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Contenedor de tarjetas -->
      <div class="row q-col-gutter-md justify-center">
        <!-- Tarjetas dinámicas -->
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          :class="[
            'col-12',
            cards.length === 1 ? 'col-sm-10 col-md-4' : 'col-sm-4 col-md-4'
          ]"
        >
          <q-card 
            class="full-height q-transition q-hoverable rounded-borders overflow-hidden" 
            :class="getCardClasses(card.estilo)"
            style="width: 100%; max-width: 340px; margin: 0 auto;"
            bordered
            flat
          >
            <!-- Imagen -->
            <q-img
              v-if="card.imagen && card.imagen.url"
              :src="`/api/proxy-image?url=${encodeURIComponent(card.imagen.url)}`"
              :ratio="1"
              fit="cover"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                  <q-icon name="image" size="3rem" color="grey-7" />
                </div>
              </template>
            </q-img>
            <div v-else class="flex flex-center bg-grey-2" style="height: 240px">
              <q-icon name="image" size="3rem" color="grey-6" />
            </div>

            <!-- Contenido de la tarjeta -->
            <q-card-section class="q-pa-md">
              <div class="text-weight-bold text-uppercase q-mb-sm" 
                   :class="[
                     `text-${getTitleColor(card.estilo)}`,
                     'text-subtitle1'
                   ]">
                {{ card.titulo }}
              </div>
              <p class="text-grey-8 q-my-sm text-body2" 
                 style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.5;">
                {{ card.descripcion }}
              </p>
              
              <q-btn
                v-if="card.enlace"
                :color="getButtonColor(card.estilo)"
                flat
                class="q-mt-sm q-px-none q-transition"
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

// Función para obtener clases de Quasar según el estilo
function getCardClasses(style) {
  const baseClasses = ['q-card--bordered', 'shadow-3'];
  
  // Agregar clases según el estilo
  switch(style) {
    case 'primary':
      return [...baseClasses, 'bg-blue-1', 'border-top', 'border-primary', 'border-3'];
    case 'secondary':
      return [...baseClasses, 'bg-green-1', 'border-top', 'border-secondary', 'border-3'];
    case 'warning':
      return [...baseClasses, 'bg-amber-1', 'border-top', 'border-warning', 'border-3'];
    case 'negative':
      return [...baseClasses, 'bg-red-1', 'border-top', 'border-negative', 'border-3'];
    case 'info':
      return [...baseClasses, 'bg-cyan-1', 'border-top', 'border-info', 'border-3'];
    case 'dark':
      return [...baseClasses, 'bg-grey-2', 'border-top', 'border-dark', 'border-3'];
    case 'accent':
      return [...baseClasses, 'bg-deep-orange-1', 'border-top', 'border-accent', 'border-3'];
    default:
      return [...baseClasses, 'bg-white', 'border-top', 'border-primary', 'border-3'];
  }
}
</script>


