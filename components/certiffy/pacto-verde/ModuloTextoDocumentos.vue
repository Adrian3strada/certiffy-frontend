<template>
  <div class="q-pa-xl">
    <q-card flat bordered class="q-pa-lg">
      <div class="text-h4 text-bold q-mb-lg">{{ titulo }}</div>
      <div class="text-body1 q-mb-xl">{{ descripcion }}</div>
      
      <div class="row q-col-gutter-lg justify-center">
        <div v-for="(documento, index) in documentos" :key="index" class="col-12 col-md-4">
          <q-card flat bordered class="text-center">
            <q-card-section>
              <q-icon name="description" size="60px" color="grey-7" />
            </q-card-section>
            
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold">{{ documento.titulo }}</div>
            </q-card-section>
            
            <q-card-actions vertical align="center">
              <q-btn flat color="primary" :to="documento.url">Ver documento</q-btn>
            </q-card-actions>
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
  documentos: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>
