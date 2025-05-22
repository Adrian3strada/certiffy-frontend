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
  titulo: 'MISIÓN',
  descripcion: 'Proporcionar herramientas tecnológicas innovadoras que simplifiquen y optimicen los procesos de certificación en la cadena de suministro agroalimentaria, garantizando transparencia, trazabilidad y sostenibilidad en cada etapa del proceso.',
  imagenFondo: '/images/landscapes/hills-light.jpg',
  posicionTexto: 'izquierda',
  alineacionTexto: 'derecha'
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
