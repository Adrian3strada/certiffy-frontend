<template>
  <q-card class="full-width q-mb-xl" flat bordered style="border-color: #8e24aa">
    <q-img 
      :src="imagenFinal" 
      height="300px"
      @error="onImageError"
    >
      <template v-slot:loading>
        <q-spinner-dots color="white" size="40px" />
      </template>
      <div class="absolute-center text-center full-width">
        <div class="text-h1 text-bold text-white" style="text-decoration: underline; text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">{{ titulo }}</div>
      </div>
    </q-img>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';

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

// Función para manejar errores de carga de imagen
function onImageError() {
  console.warn(`Error al cargar la imagen: ${props.imagenUrl}`);
  imagenError.value = true;
}
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
