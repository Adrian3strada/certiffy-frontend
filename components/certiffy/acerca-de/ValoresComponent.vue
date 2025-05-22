<template>
  <InfoSectionComponent
    :titulo="componentData.titulo"
    :descripcion="componentData.descripcion"
    :imagenFondo="componentData.imagenFondo"
    :posicionTexto="componentData.posicionTexto"
    :alineacionTexto="componentData.alineacionTexto"
  />
</template>

<script setup>
import { computed } from 'vue';
import InfoSectionComponent from './InfoSectionComponent.vue';

// Datos por defecto
const defaultData = {
  titulo: 'VALORES',
  descripcion: 'Integridad, Innovación, Sostenibilidad, Transparencia y Compromiso con la excelencia. Estos principios guían nuestras acciones y decisiones, mientras trabajamos para transformar positivamente la industria agroalimentaria.',
  imagenFondo: '/images/landscapes/hills-light.jpg',
  posicionTexto: 'centro-enmarcado',
  alineacionTexto: 'centro'
};

// Definir props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

// Combinar datos recibidos por props con los datos por defecto
const componentData = computed(() => {
  return {
    ...defaultData,
    ...props.data
  };
});
</script>
