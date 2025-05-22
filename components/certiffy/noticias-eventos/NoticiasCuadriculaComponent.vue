<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 text-center text-weight-bold q-mb-md">{{ notaInformativa }}</div>
    <div class="row q-col-gutter-md justify-center">
      <div 
        v-for="(noticia, index) in noticias" 
        :key="index" 
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card class="noticia-card" flat bordered style="border-radius: 18px; overflow: hidden;">
          <q-img
            :src="noticia.imagenUrl"
            style="height: 440px"
            class="full-width"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-green-2">
                <q-icon name="image" size="2rem" color="white" />
              </div>
            </template>
            <div class="absolute-bottom bg-green-9 text-white q-pa-sm">
              <div class="text-subtitle1 text-weight-bold text-center">
                {{ noticia.titulo }}
              </div>
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  noticias: {
    type: Array,
    required: true,
    default: () => []
  },
  notaInformativa: {
    type: String,
    default: 'Alianza estratégica para mejorar la trazabilidad en la cadena de suministro agrícola.'
  }
});
</script>
