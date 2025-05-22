<template>
  <section class="q-py-xl q-px-md bg-grey-1">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Imagen de cabecera -->
      <q-card class="q-mb-xl overflow-hidden shadow-2">
        <q-img
          :src="backgroundImage"
          height="350px"
          :ratio="16/5"
        >
          <div class="absolute-full bg-black" style="opacity: 0.4"></div>
          <div class="absolute-center text-center q-pa-lg" style="width: 100%">
            <div class="text-h3 text-white text-weight-bold q-mb-md">{{ title }}</div>
            <div v-if="subtitle" class="text-subtitle1 text-white">{{ subtitle }}</div>
          </div>
        </q-img>
      </q-card>
      
      <!-- Categorías del módulo -->
      <div class="q-py-xl">
        <div class="row q-col-gutter-xl justify-center">
          <div 
            v-for="(category, index) in categories" 
            :key="index" 
            class="col-12 col-md-5"
          >
            <q-card 
              class="h-100 q-hoverable shadow-2" 
              style="transition: transform 0.3s ease, box-shadow 0.3s ease"
              :style="{ transform: 'translateY(0)' }"
              @mouseover="e => e.target.style.transform = 'translateY(-5px)'"
              @mouseleave="e => e.target.style.transform = 'translateY(0)'"
              bordered
            >
              <q-card-section class="bg-dark text-white text-center q-py-md">
                <div class="text-h5 text-weight-medium">{{ category.title }}</div>
              </q-card-section>
              
              <q-card-section class="q-pa-lg">
                <div class="text-body1 q-mb-md">{{ category.description }}</div>
                
                <q-list padding separator v-if="category.features && category.features.length">
                  <q-item v-for="(feature, idx) in category.features" :key="idx">
                    <q-item-section avatar>
                      <q-icon name="check_circle" color="positive" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ feature }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              
              <q-card-actions vertical align="center" class="q-pb-md">
                <q-btn
                  color="primary"
                  :to="category.url"
                  :label="category.buttonText || 'Más información'"
                  no-caps
                  unelevated
                  rounded
                  class="q-py-sm q-px-xl"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      
      <!-- Categorías de cabecera -->
      <div v-if="showHeaderCategories" class="q-mt-xl q-mb-md">
        <div class="row justify-center q-gutter-md text-center">
          <div v-for="(cat, index) in headerCategories" :key="index" class="col-auto">
            <q-chip
              color="primary"
              text-color="white"
              class="text-weight-medium q-px-md"
              size="lg"
            >
              {{ cat }}
            </q-chip>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'PACTO VERDE'
  },
  subtitle: {
    type: String,
    default: '(ES UN APARTADO DONDE SE HABLA DE LA DUE DILIGENCE Y LA UNIÓN EUROPEA)'
  },
  backgroundImage: {
    type: String,
    default: 'https://placehold.co/1200x400/e3f2fd/1e88e5?text=Pacto+Verde'
  },
  categories: {
    type: Array,
    default: () => [
      {
        title: 'UNIÓN EUROPEA',
        description: 'Cumplimiento de las normativas de la Unión Europea relacionadas con la sostenibilidad y la trazabilidad en la cadena de suministro agroalimentaria.',
        url: '/pacto-verde/union-europea',
        buttonText: 'Ver normativas',
        features: [
          'Regulación de deforestación',
          'Pacto Verde Europeo',
          'Estrategia Farm to Fork'
        ]
      },
      {
        title: 'DUE DILIGENCE',
        description: 'Proceso de debida diligencia para asegurar el cumplimiento de las normativas ambientales y sociales en toda la cadena de valor.',
        url: '/pacto-verde/due-diligence',
        buttonText: 'Más información',
        features: [
          'Evaluación de riesgos',
          'Certificación de procesos',
          'Monitoreo continuo'
        ]
      }
    ]
  },
  headerCategories: {
    type: Array,
    default: () => ['Trazabilidad', 'Administración', 'Certificación']
  },
  showHeaderCategories: {
    type: Boolean,
    default: true
  }
});
</script>