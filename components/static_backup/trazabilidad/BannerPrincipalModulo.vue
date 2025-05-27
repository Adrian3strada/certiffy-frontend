<template>
  <ModuloBanner
    :tamanio-banner="'normal'"
    :imagen-fondo="imagenFinal"
    :usar-overlay="true"
    :titulo="titulo"
    :titulo-clase="'text-h1 text-weight-bold text-white'"
    :color-overlay="'rgba(0, 0, 0, 0.4)'"
    :posicion-texto="'center'"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import ModuloBanner from '../base/ModuloBanner.vue';

const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  }
});

// Control de error de carga de imagen
const imagenError = ref(false);
const imagenRespaldo = 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

// Imagen final a mostrar (la prop o la de respaldo si hay error)
const imagenFinal = computed(() => {
  return imagenError.value ? imagenRespaldo : props.imagenUrl;
});

// La funcionalidad de manejo de errores está incorporada en el ModuloBanner
// Si necesitamos capturar el error específicamente, podemos emitir un evento
</script>

<style scoped>
.q-banner {
  display: flex;
  align-items: end;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.text-h4 {
  text-shadow: 0 1px 6px rgba(0,0,0,0.18);
}
</style>
