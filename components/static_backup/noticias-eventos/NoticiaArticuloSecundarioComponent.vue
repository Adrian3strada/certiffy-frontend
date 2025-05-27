<template>
  <q-card class="noticia-articulo-secundario-card q-mb-lg" flat bordered>
    <q-card-section>
      <div class="text-h6 text-weight-bold q-mb-md">{{ titulo }}</div>
      <div class="text-body2">{{ contenido }}</div>
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
  }
});
</script>
