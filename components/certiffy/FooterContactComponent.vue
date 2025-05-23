<template>
  <footer class="bg-dark text-white">
    <div class="q-pa-md q-mx-auto" style="max-width: 1200px;">
      <div class="row q-col-gutter-md justify-between items-start q-py-md">
        <!-- Información de contacto (lado izquierdo) -->
        <div class="col-12 col-md-5">
          <div class="q-mb-md">
            <div class="text-subtitle1 text-weight-bold">{{ direccionTitle }}</div>
            <div class="text-body2 q-mt-xs">{{ direccion }}</div>
          </div>
          
          <div class="q-mb-md">
            <div class="text-subtitle1 text-weight-bold">{{ contactoTitle }}</div>
            <div class="text-body2 q-mt-xs">{{ telefono }}</div>
          </div>
          
          <!-- Redes sociales -->
          <div class="q-mt-lg">
            <div class="row q-gutter-sm">
              <div v-for="(social, index) in redesSociales" :key="index">
                <q-btn
                  round
                  flat
                  :color="social.color || 'white'"
                  :href="social.url"
                  target="_blank"
                  :icon="social.icon"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Imagen (lado derecho) -->
        <div class="col-12 col-md-5 flex justify-end items-start">
          <q-img
            :src="imagenUrl"
            width="180px"
            class="rounded-borders"
            spinner-color="primary"
          />
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="text-center q-py-sm text-caption">
        <q-separator dark class="q-mb-sm" />
        {{ copyrightText }}
      </div>
    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  direccionTitle: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  contactoTitle: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  },
  redesSociales: {
    type: Array,
    required: true
  },
  copyrightText: {
    type: String,
    required: true
  }
});
</script>
