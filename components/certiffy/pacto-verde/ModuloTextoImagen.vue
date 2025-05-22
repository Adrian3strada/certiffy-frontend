<template>
  <div class="q-pa-xl">
    <q-card flat bordered class="q-pa-lg">
      <div class="text-h4 text-bold q-mb-md">{{ titulo }}</div>
      <div class="text-body1 q-mb-xl">{{ texto }}</div>
      
      <div class="q-mt-md">
        <q-img 
          :src="imagenUrl" 
          spinner-color="primary"
          spinner-size="82px"
          height="400px"
          fit="cover"
          class="rounded-borders"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center text-negative">
              <q-icon name="error" size="3rem" />
              <div class="text-h6 q-mt-md">Error al cargar la imagen</div>
            </div>
          </template>
          <div class="absolute-bottom text-subtitle1 flex flex-center" style="background: rgba(0,0,0,0.7)">
            <div class="text-h5 text-bold text-white q-py-sm">{{ imagenTitulo }}</div>
          </div>
        </q-img>
      </div>
    </q-card>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: {
    type: String,
    default: '(TEXTO #2)'
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

// Podemos añadir algo de logging para depuración
console.log("ModuloTextoImagen props:", props);
</script>

<style scoped>
.imagen-container {
  position: relative;
  margin-top: 2rem;
}

.texto-sobre-imagen {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
