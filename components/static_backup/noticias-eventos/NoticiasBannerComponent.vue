<template>
  <q-card class="noticia-banner-card no-shadow" flat bordered>
    <q-img
      :src="imagenUrl"
      :ratio="16/7"
      class="full-width"
    >
      <div class="absolute-bottom bg-transparent q-pa-md">
        <div class="row">
          <div class="col-12 col-md-8">
            <q-badge
              color="primary"
              class="q-mb-sm text-subtitle1"
              v-if="categoria"
            >
              {{ categoria }}
            </q-badge>
            <div class="text-h4 text-weight-bold text-black text-shadow-1">{{ titulo }}</div>
            <div class="text-subtitle1 text-black text-shadow-1 q-mt-sm">{{ descripcion }}</div>
          </div>
        </div>
      </div>
    </q-img>
  </q-card>
</template>

<script setup>
// Define props del componente
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    default: null
  }
});
</script>
