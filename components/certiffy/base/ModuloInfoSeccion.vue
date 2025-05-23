<template>
  <section class="q-pa-md">
    <ModuloMedia
      :titulo="titulo"
      :texto="descripcion"
      :media-url="imagenFondo"
      :posicion-media="posicionMediaMap[posicionTexto]"
      :distribucion-columnas="distribucionColumnasMap[posicionTexto]"
      :titulo-clase="'text-h4 text-weight-bold ' + colorTextoClase"
      :texto-clase="'text-body1 ' + colorTextoClase"
      :media-ratio="mediaRatio"
      :usar-overlay="true"
      :color-overlay="colorOverlay"
      :alineacion-titulo="alineacionTexto"
      :alineacion-texto="alineacionTexto"
      :borde="borde"
      :espaciado="espaciado"
      :texto-sobre-media="true"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import ModuloMedia from './ModuloMedia.vue';

const props = defineProps({
  // Contenido
  titulo: {
    type: String,
    default: ''
  },
  descripcion: {
    type: String,
    default: ''
  },
  imagenFondo: {
    type: String,
    default: ''
  },
  
  // Posicionamiento
  posicionTexto: {
    type: String,
    default: 'izquierda',
    validator: (value) => ['izquierda', 'derecha', 'centro-enmarcado'].includes(value)
  },
  alineacionTexto: {
    type: String,
    default: 'izquierda',
    validator: (value) => ['izquierda', 'derecha', 'centro'].includes(value)
  },
  
  // Apariencia
  mediaRatio: {
    type: Number,
    default: 16/9
  },
  colorTexto: {
    type: String,
    default: 'white'
  },
  colorOverlay: {
    type: String,
    default: 'rgba(0, 0, 0, 0.5)'
  },
  borde: {
    type: Boolean,
    default: true
  },
  espaciado: {
    type: String,
    default: 'normal'
  }
});

// Mapeo de posición de texto a posición de media
const posicionMediaMap = computed(() => ({
  'izquierda': 'right',
  'derecha': 'left',
  'centro-enmarcado': 'background'
}));

// Mapeo de posición de texto a distribución de columnas
const distribucionColumnasMap = computed(() => ({
  'izquierda': '7-5',
  'derecha': '5-7',
  'centro-enmarcado': '12-0'
}));

// Clase para el color de texto
const colorTextoClase = computed(() => {
  return `text-${props.colorTexto}`;
});
</script>
