<template>
  <footer class="footer-contact-component bg-dark text-white">
    <div class="q-pa-md q-mx-auto" style="max-width: 1200px;">
      <div class="row q-col-gutter-md q-col-gutter-lg-xl justify-between items-start q-py-md">
        <!-- Información de contacto (lado izquierdo) -->
        <div class="col-12 col-sm-6 col-md-5 contact-info">
          <div class="q-mb-md address-section">
            <div class="section-title text-subtitle1 text-weight-bold">{{ direccionTitle }}</div>
            <div class="section-content text-body2 q-mt-xs">{{ direccion }}</div>
          </div>
          
          <div class="q-mb-md contact-section">
            <div class="section-title text-subtitle1 text-weight-bold">{{ contactoTitle }}</div>
            <div class="section-content text-body2 q-mt-xs">{{ telefono }}</div>
          </div>
          
          <!-- Redes sociales -->
          <div class="q-mt-lg social-media-section">
            <div class="row q-gutter-sm">
              <div v-for="(social, index) in redesSociales" :key="index" class="social-icon-container">
                <q-btn
                  round
                  flat
                  :color="social.color || 'white'"
                  :href="social.url"
                  target="_blank"
                  :icon="social.icon"
                  size="sm"
                  class="social-icon-btn"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Imagen (lado derecho) -->
        <div class="col-12 col-sm-6 col-md-5 flex justify-center justify-sm-end items-start q-mt-md q-mt-sm-none logo-container">
          <q-img
            :src="imagenUrl"
            :width="logoWidth"
            class="footer-logo rounded-borders"
            spinner-color="primary"
          />
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="text-center q-py-sm text-caption copyright-section">
        <q-separator dark class="q-mb-sm" />
        {{ copyrightText }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

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

// Estado para el ancho de la ventana
const windowWidth = ref(window.innerWidth);

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Ancho del logo responsivo
const logoWidth = computed(() => {
  if (windowWidth.value < 600) {
    return '150px';
  } else if (windowWidth.value < 1024) {
    return '160px';
  } else {
    return '180px';
  }
});
</script>

<style scoped>
.footer-contact-component {
  width: 100%;
}

.footer-contact-component .footer-logo {
  transition: width 0.3s ease;
}

.footer-contact-component .social-icon-btn {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.footer-contact-component .social-icon-btn:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .footer-contact-component .section-title {
    font-size: 1rem !important;
  }
  
  .footer-contact-component .section-content {
    font-size: 0.875rem !important;
  }
  
  .footer-contact-component .contact-info {
    margin-bottom: 1.5rem;
  }
  
  .footer-contact-component .social-media-section {
    margin-top: 1rem !important;
  }
  
  .footer-contact-component .copyright-section {
    font-size: 0.7rem !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .footer-contact-component .section-title {
    font-size: 1.1rem !important;
  }
  
  .footer-contact-component .section-content {
    font-size: 0.9rem !important;
  }
}
</style>
