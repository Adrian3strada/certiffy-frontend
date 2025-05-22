<template>
  <div class="q-pa-xl">
    <q-card flat bordered class="q-pa-lg">
      <div class="text-h4 text-bold q-mb-md">{{ titulo }}</div>
      <div class="text-body1 q-mb-xl">{{ descripcion }}</div>
      
      <div class="row q-col-gutter-md justify-center">
        <div v-for="(imagen, index) in imagenes" :key="index" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-none">
            <q-img 
              :src="imagen.url" 
              height="200px"
              class="rounded-borders full-width"
            >
              <div class="absolute-bottom text-center bg-transparent">
                <div class="text-h6 text-bold text-white">{{ imagen.titulo }}</div>
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
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
  imagenes: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>
