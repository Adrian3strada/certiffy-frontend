<template>
  <div class="q-pa-xl">
    <q-card flat bordered class="q-pa-lg">
      <div class="row q-col-gutter-xl" :class="{ 'flex-row-reverse': reverseLayout }">
        <div class="col-12 col-md-7">
          <div class="text-h4 text-bold q-mb-md">{{ titulo }}</div>
          <div class="text-body1 q-mb-lg">{{ texto }}</div>
          <div v-if="textoAdicional" class="text-body1 q-mt-md">
            {{ textoAdicional }}
          </div>
        </div>
        <div class="col-12 col-md-5">
          <q-img 
            :src="imagenUrl" 
            spinner-color="primary"
            spinner-size="82px"
            height="300px"
            fit="cover"
            class="rounded-borders"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center text-negative">
                <q-icon name="error" size="2rem" />
              </div>
            </template>
            <div class="absolute-bottom text-center" style="background: rgba(0,0,0,0.4)">
              <div class="text-h5 text-bold text-white q-py-sm">{{ imagenTitulo }}</div>
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
  texto: {
    type: String,
    required: true
  },
  textoAdicional: {
    type: String,
    default: ''
  },
  imagenUrl: {
    type: String,
    required: true
  },
  imagenTitulo: {
    type: String,
    required: true
  },
  reverseLayout: {
    type: Boolean,
    default: false
  }
});
</script>
