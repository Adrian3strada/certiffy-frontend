<template>
  <div class="q-pa-xl">
    <q-card flat bordered class="q-pa-md q-mb-lg">
      <div class="text-h5 text-bold q-mb-md">{{ titulo || '(TEXTO #2)' }}</div>
      <div class="text-body1 q-mb-lg">{{ texto }}</div>
    </q-card>
    
    <q-card flat bordered class="q-pa-none">
      <img 
        :src="props.imagenUrl" 
        class="full-width img-responsive"
        style="height: 250px; object-fit: cover;"
        :alt="imagenTitulo || 'Imagen'"
      />
      <div class="bg-primary text-center q-py-md">
        <div class="text-h5 text-bold text-white">{{ imagenTitulo || 'FOTO' }}</div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  titulo: {
    type: String,
    default: ''
  },
  texto: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  },
  imagenTitulo: {
    type: String,
    default: 'FOTO'
  }
});

// Control de error de carga de imagen
const imagenError = ref(false);
const imagenRespaldo = 'https://images.unsplash.com/photo-1603126857599-f935e8f5c31e?q=80&w=1200&auto=format&fit=crop';

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
/* Todos los estilos se manejan con Quasar */
</style>
