<template>
  <div class="q-pa-xl">
    <!-- TITULAR -->
    <div class="text-h4 text-bold text-center q-mb-xl">
      <span class="text-decoration-underline">{{ titulo }}</span>
    </div>

    <div class="row q-col-gutter-xl items-start">
      <!-- COLUMNA: Imagen -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-pa-none">
          <q-img 
            :src="imagenUrl" 
            style="height: 300px;"
            class="rounded-borders full-width"
          />
          <div class="text-h5 text-bold text-center q-mt-sm">FOTO 1</div>
        </q-card>
      </div>

      <!-- COLUMNA: Texto -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="q-pa-md">
          <div class="text-h5 text-bold q-mb-md">( {{ subtitulo }} )</div>
          <div class="text-body1">
            {{ descripcion }}
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  subtitulo: {
    type: String,
    required: true,
    default: 'Texto #1'
  },
  descripcion: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  }
})
</script>
