<template>
  <ModuloGaleria
    :titulo="titulo"
    :descripcion="descripcion"
    :items="documentosFormateados"
    :tipo-galeria="'documentos'"
    :columnas-desktop="3"
    :columnas-tablet="2"
    :columnas-mobile="1"
    :borde="true"
    :borde-items="true"
    :efecto-elevacion-items="true"
    :espaciado="'normal'"
  />
</template>

<script setup>
import { computed } from 'vue';
import ModuloGaleria from '../base/ModuloGaleria.vue';

// Definir props que recibirá el componente
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  documentos: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Formatear documentos para el componente base
const documentosFormateados = computed(() => {
  return props.documentos.map(doc => ({
    titulo: doc.titulo,
    url: doc.url,
    icono: 'description',
    accion: 'Ver documento'
  }));
});
</script>
