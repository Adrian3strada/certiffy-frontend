<template>
  <q-card class="noticia-articulo-card q-mb-lg" flat bordered>
    <q-card-section>
      <div class="text-caption text-grey-7">{{ fecha }}</div>
      <div class="text-h5 text-weight-bold q-mb-md">{{ titulo }}</div>
      <div class="text-body1">{{ contenido }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
// Define props del componente
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  fecha: {
    type: String,
    required: true
  }
});
</script>
