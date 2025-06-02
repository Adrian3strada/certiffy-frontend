<template>
  <footer class="api-footer-component bg-certiffy-azul">
    <div class="footer-content q-py-lg">
      <div class="container-xl q-mx-auto">
        <div class="row q-col-gutter-md">
          <!-- Logo y copyright -->
          <div class="col-12 col-md-4 column items-start q-gutter-y-md">
            <div class="logo-container">
              <q-img
                src="/images/logo-white.png"
                width="160px"
                height="auto"
                class="logo q-mb-md"
                fit="contain"
                placeholder-src="/images/logo-placeholder.png"
              >
                <template v-slot:error>
                  <div class="logo-placeholder">
                    <h4 class="text-certiffy-dorado" style="font-family: 'OpenSans-ExtraBold', sans-serif;">CERTIFFY</h4>
                  </div>
                </template>
              </q-img>
            </div>
            <p class="copyright text-caption q-mb-none text-certiffy-dorado" style="font-family: 'OpenSans-SemiBold', sans-serif;">
              © {{ new Date().getFullYear() }} CERTIFFY. Todos los derechos reservados.
            </p>
          </div>

          <!-- Links de navegación -->
          <div class="col-12 col-md-4 column items-center q-gutter-y-md">
            <h6 class="text-certiffy-dorado q-mb-sm" style="font-family: 'OpenSans-Bold', sans-serif;">Enlaces</h6>
            <div v-if="loading" class="text-center full-width">
              <q-spinner color="white" size="1.5em" />
            </div>
            <div v-else-if="error" class="text-negative">
              <q-icon name="warning" /> Error al cargar enlaces
            </div>
            <div v-else class="navigation-links column items-center q-gutter-y-sm">
              <q-btn
                v-for="(link, index) in footerLinks"
                :key="index"
                :to="formatLink(link.url)"
                flat
                no-caps
                class="footer-link hover-effect"
                :label="formatTitle(link.titulo)"
                text-color="white"
                padding="sm md"
                style="font-family: 'OpenSans-SemiBold', sans-serif;"
              />
            </div>
          </div>

          <!-- Redes sociales y contacto -->
          <div class="col-12 col-md-4 column items-end q-gutter-y-md">
            <h6 class="text-certiffy-dorado q-mb-sm q-mr-md" style="font-family: 'OpenSans-Bold', sans-serif;">Síguenos</h6>
            <div class="social-links row q-gutter-md justify-end">
              <q-btn round flat color="amber" icon="fab fa-facebook" href="#" target="_blank" class="hover-effect" />
              <q-btn round flat color="amber" icon="fab fa-twitter" href="#" target="_blank" class="hover-effect" />
              <q-btn round flat color="amber" icon="fab fa-instagram" href="#" target="_blank" class="hover-effect" />
              <q-btn round flat color="amber" icon="fab fa-linkedin" href="#" target="_blank" class="hover-effect" />
            </div>
            <div class="contact-info text-right q-mt-md">
              <p class="text-caption text-certiffy-dorado q-mb-xs" style="font-family: 'OpenSans-SemiBold', sans-serif;">
                <q-icon name="email" size="xs" class="q-mr-xs" /> info@certiffy.com
              </p>
              <p class="text-caption text-certiffy-dorado q-mb-none" style="font-family: 'OpenSans-SemiBold', sans-serif;">
                <q-icon name="phone" size="xs" class="q-mr-xs" /> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Segunda sección para términos y políticas -->
    <div class="footer-bottom q-py-sm bg-certiffy-azul" style="border-top: 1px solid rgba(223, 187, 67, 0.3);">
      <div class="container-xl q-mx-auto">
        <div class="row justify-between items-center">
          <div class="col-12 col-md-auto">
            <div class="terms-links row q-col-gutter-md q-mt-sm-none q-mt-md">
              <q-btn flat dense no-caps text-color="amber-2" label="Términos y Condiciones" class="text-caption hover-effect" style="font-family: 'OpenSans-SemiBold', sans-serif;" to="/terminos" />
              <q-btn flat dense no-caps text-color="amber-2" label="Política de Privacidad" class="text-caption hover-effect" style="font-family: 'OpenSans-SemiBold', sans-serif;" to="/privacidad" />
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <p class="text-caption text-amber-2 q-mb-none q-mt-sm-none q-mt-md" style="font-family: 'OpenSans-SemiBold', sans-serif;">
              Desarrollado por <a href="#" class="text-certiffy-dorado hover-effect">Equipo CERTIFFY</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const router = useRouter();
const footerLinks = ref([]);
const loading = ref(true);
const error = ref(null);

// Función para formatear los títulos (capitalizar primera letra)
const formatTitle = (title) => {
  if (!title) return '';
  return title.charAt(0).toUpperCase() + title.slice(1);
};

// Función para formatear los enlaces (convertir URLs absolutas a rutas relativas)
const formatLink = (url) => {
  if (!url) return '/';
  
  // Si es una URL interna (contiene localhost o 127.0.0.1)
  if (url.includes('127.0.0.1') || url.includes('localhost')) {
    try {
      // Extraer la ruta de la URL completa
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      
      // Eliminar el slash final si existe
      if (path.endsWith('/') && path !== '/') {
        path = path.slice(0, -1);
      }
      
      return path;
    } catch (e) {
      console.error('Error al procesar la URL:', e);
      return '/';
    }
  }
  
  // Si es una URL externa, devolver como está
  return url;
};

// Función para obtener los enlaces del footer desde la API
const fetchFooterLinks = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Usar useFetch de Nuxt para obtener los datos
    const { data, error: fetchError } = await useFetch('/api/proxy-wagtail', {
      query: {
        path: '/api/v2/footer/'
      },
      timeout: 5000 // 5 segundos de timeout
    });
    
    if (fetchError.value) {
      error.value = 'Error al cargar el footer: ' + fetchError.value.message;
      footerLinks.value = [
        { titulo: 'inicio', url: '/' },
        { titulo: 'nosotros', url: '/acerca-de' },
        { titulo: 'contacto', url: '/contacto' }
      ];
    } else if (data.value && data.value.items) {
      footerLinks.value = data.value.items;
    } else {
      footerLinks.value = [
        { titulo: 'inicio', url: '/' },
        { titulo: 'nosotros', url: '/acerca-de' },
        { titulo: 'contacto', url: '/contacto' }
      ];
    }
  } catch (e) {
    console.error('Error en la solicitud del footer:', e);
    error.value = 'Error en la solicitud: ' + e.message;
    // Datos de respaldo
    footerLinks.value = [
      { titulo: 'inicio', url: '/' },
      { titulo: 'nosotros', url: '/acerca-de' },
      { titulo: 'contacto', url: '/contacto' }
    ];
  } finally {
    loading.value = false;
  }
};

// Cargar los enlaces al montar el componente
onMounted(() => {
  fetchFooterLinks();
});
</script>

<style scoped>
.api-footer-component {
  background-color:rgb(0, 0, 0);
  color: white;
}

.footer-content {
  position: relative;
  padding: 3rem 1rem;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

.social-links .q-btn {
  transition: all 0.3s ease;
}

.social-links .q-btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
}

.logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1rem;
}

.terms-links .q-btn:hover {
  color: white !important;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .api-footer-component .col-md-4 {
    text-align: center;
    align-items: center !important;
    margin-bottom: 1.5rem;
  }
  
  .social-links,
  .contact-info {
    text-align: center;
    justify-content: center;
  }
  
  .footer-bottom .row {
    justify-content: center !important;
    text-align: center;
  }
}
</style>
