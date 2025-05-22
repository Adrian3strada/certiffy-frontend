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
  titulo: 'VISIÓN',
  descripcion: 'Ser reconocidos globalmente como la plataforma líder en soluciones de certificación para el sector agroalimentario, facilitando el cumplimiento normativo internacional y promoviendo prácticas sostenibles que beneficien a productores, consumidores y al planeta.',
  imagenFondo: '/images/landscapes/hills-light.jpg',
  posicionTexto: 'derecha',
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
