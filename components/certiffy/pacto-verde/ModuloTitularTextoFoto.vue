<template>
  <div class="q-pa-xl">
    <q-card flat bordered class="q-pa-lg">
      <div class="text-center q-mb-xl">
        <div class="text-h3 text-bold q-mb-md">{{ titulo }}</div>
      </div>

      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-8">
          <div class="text-h4 text-bold q-mb-md">{{ subtitulo }}</div>
          <div class="text-body1">{{ descripcion }}</div>
        </div>
        <div class="col-12 col-md-4">
          <q-img 
            :src="imagenUrl" 
            spinner-color="primary"
            spinner-size="82px"
            height="220px"
            fit="cover"
            class="rounded-borders"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center text-negative">
                <q-icon name="error" size="2rem" />
              </div>
            </template>
            <div class="absolute-full text-center flex flex-center" style="background: rgba(0,0,0,0.4)">
              <div class="text-h5 text-bold text-white">{{ imagenTitulo }}</div>
            </div>
          </q-img>
        </div>
      </div>
    </q-card>
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
    required: true
  },
  descripcion: {
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
</script>
