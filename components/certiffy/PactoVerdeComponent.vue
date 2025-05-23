<template>
  <section class="certiffy-seccion">
    <!-- Banner Principal -->
    <ModuloBanner
      :tamanio-banner="'grande'"
      :imagen-fondo="backgroundImage"
      :usar-overlay="true"
      :titulo="title"
      :subtitulo="subtitle"
      :titulo-clase="'text-h3 text-weight-bold text-white'"
      :subtitulo-clase="'text-subtitle1 text-white'"
      :posicion-texto="'center'"
    />
    
    <!-- Categorías del módulo -->
    <div class="certiffy-contenedor q-py-xl">
      <div class="row q-col-gutter-xl justify-center">
        <div 
          v-for="(category, index) in categories" 
          :key="index" 
          class="col-12 col-md-5"
        >
          <ModuloTarjeta
            :titulo="category.title"
            :contenido="category.description"
            :accion-primaria="category.buttonText || 'Más información'"
            :ruta-accion-primaria="category.url"
            :color-accion-primaria="'primary'"
            :efecto-hover="true"
            :borde="true"
            tarjeta-clase="h-100"
          >
            <template v-slot:contenido-personalizado>
              <q-list v-if="category.features && category.features.length" padding separator>
                <q-item v-for="(feature, idx) in category.features" :key="idx">
                  <q-item-section avatar>
                    <q-icon name="check_circle" color="positive" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ feature }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </ModuloTarjeta>
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
import ModuloBanner from './base/ModuloBanner.vue';
import ModuloTarjeta from './base/ModuloTarjeta.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  backgroundImage: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  headerCategories: {
    type: Array,
    required: true
  },
  showHeaderCategories: {
    type: Boolean,
    required: true
  }
});
</script>

<style scoped>
.certiffy-seccion {
  width: 100%;
  background-color: var(--q-grey-1);
}

.certiffy-contenedor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>