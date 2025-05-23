<template>
  <div class="q-py-xl bg-grey-1">
    <div class="container q-mx-auto q-px-md">
      <div class="text-center q-mb-xl">
        <div class="text-h3 text-weight-bold q-mb-md">{{ titulo }}</div>
        <div class="text-body1 q-mx-auto" style="max-width: 800px">{{ descripcion }}</div>
      </div>
      
      <div class="row q-col-gutter-lg">
        <div 
          v-for="(tarjeta, index) in tarjetas" 
          :key="index"
          class="col-12 col-sm-6 col-md-4"
        >
          <ModuloTarjeta
            :titulo="tarjeta.titulo"
            :subtitulo="tarjeta.subtitulo"
            :contenido="tarjeta.contenido"
            :imagen-url="tarjeta.imagenUrl"
            :imagen-overlay="tarjeta.imagenOverlay"
            :accion-primaria="tarjeta.accionPrimaria"
            :ruta-accion-primaria="tarjeta.rutaAccionPrimaria"
            :efecto-hover="true"
            :borde="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ModuloTarjeta from '../base/ModuloTarjeta.vue';

defineProps({
  titulo: {
    type: String,
    default: 'Servicios'
  },
  descripcion: {
    type: String,
    default: 'Conoce nuestros servicios especializados'
  },
  tarjetas: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
