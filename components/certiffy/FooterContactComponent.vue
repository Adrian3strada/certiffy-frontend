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
        {{ new Date().getFullYear() }} CERTIFFY. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  direccionTitle: {
    type: String,
    default: 'Dirección'
  },
  direccion: {
    type: String,
    default: 'Mexico'
  },
  contactoTitle: {
    type: String,
    default: 'Contacto'
  },
  telefono: {
    type: String,
    default: 'Teléfono: +52 (433) 822 7028'
  },
  imagenUrl: {
    type: String,
    default: 'https://placehold.co/400x400/e6f7ff/0288d1?text=CERTIFFY'
  },
  redesSociales: {
    type: Array,
    default: () => [
      { icon: 'mdi-linkedin', url: 'https://www.linkedin.com/', color: 'blue-7' },
      { icon: 'mdi-facebook', url: 'https://www.facebook.com/', color: 'blue-9' },
      { icon: 'mdi-instagram', url: 'https://www.instagram.com/', color: 'purple-5' },
      { icon: 'mdi-twitter', url: 'https://www.twitter.com/', color: 'light-blue-5' }
    ]
  }
});
</script>
