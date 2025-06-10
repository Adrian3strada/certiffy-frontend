<template>
  <!-- Footer con los colores de Quasar de la empresa -->
  <div class="footer-wrapper bg-primary">
    
    <!-- Sección principal del footer -->
    <div class="container q-py-md">
      <div class="row q-col-gutter-md">
        
        <!-- Logo y descripción -->
        <div class="col-12 col-md-4 q-py-md">
          <!-- Logo desde la API -->
          <div class="text-center text-md-left">
            <a href="/" class="no-text-decoration">
              <div class="logo-container">
                <img 
                  v-if="logo && getLogo()" 
                  :src="getLogo()" 
                  class="certify-logo" 
                  alt="CERTIFY" 
                  @error="handleImageError"
                  @load="() => console.log('Logo cargado correctamente')"
                />
                <div v-else class="certify-logo bg-primary text-white text-center rounded-borders q-pa-sm">
                  <span class="text-h5 text-weight-bold">CERTIFY</span>
                </div>
              </div>
            </a>
          </div>
          
          <!-- Descripción de la plataforma (texto a cambiar cuando venga de la API) -->
          <p class="text-grey-6 q-py-md">
            {{ description || 'Plataforma integral de trazabilidad y certificación para cadenas de suministro sostenibles.' }}
          </p>
          
          <!-- Información de contacto con colores Quasar -->
          <div class="text-grey-6 contact-info">
            <div class="q-py-xs">
              <q-icon color="accent" name="location_on" size="xs" class="q-mr-xs" />
              {{ address || 'Calle Principal 123, Ciudad' }}
            </div>
            <div class="q-py-xs">
              <q-icon color="accent" name="email" size="xs" class="q-mr-xs" />
              {{ email || 'info@certify.com' }}
            </div>
            <div class="q-py-xs">
              <q-icon color="accent" name="phone" size="xs" class="q-mr-xs" />
              {{ phone || '+1 (555) 123-4567' }}
            </div>
          </div>
        </div>
        
        <!-- Newsletter y redes sociales -->
        <div class="col-12 col-md-4 q-py-md text-center">
          <h4 class="text-grey-6 q-mb-md">Subscríbete a nuestro boletín</h4>
          
          <!-- Input de suscripción -->
          <q-input 
            v-model="newsletterEmail" 
            outlined 
            dense
            placeholder="Tu correo electrónico" 
            dark
            class="newsletter-input"
          />
          
          <!-- Sección de redes sociales -->
          <h4 class="text-grey-6 q-mt-lg q-mb-md">Síguenos en redes sociales</h4>
          
          <!-- Iconos de redes sociales -->
          <div class="row justify-center q-gutter-md">
            <q-btn round no-caps color="accent" icon="fab fa-facebook-f" href="#" target="_blank" class="social-btn" />
            <q-btn round no-caps color="accent" icon="fab fa-twitter" href="#" target="_blank" class="social-btn" />
            <q-btn round no-caps color="accent" icon="fab fa-instagram" href="#" target="_blank" class="social-btn" />
          </div>
          
          <!-- Botón de suscripción a newsletter -->
          <div class="q-mt-sm">
            <q-btn v-if="!loading" no-caps color="warning" label="Suscribirse" icon="send" @click="subscribeNewsletter" />
          </div>
        </div>
                <!-- Enlaces de navegación -->
        <div class="col-12 col-md-4 q-py-md nav-links">
          <h4 class="text-grey-6 q-mb-md">Enlaces rápidos</h4>
          <q-list padding dense>
            <template v-if="loading">
              <q-item v-for="i in 5" :key="i">
                <q-item-section>
                  <q-skeleton type="text" />
                </q-item-section>
              </q-item>
            </template>
            
            <!-- Mostramos los enlaces de la API -->
            <template v-if="!loading && navigationItems.length > 0">
              <q-item 
                v-for="link in navigationItems" 
                :key="link.id"
                tag="a"
                :href="link.url"
                clickable
                class="footer-nav-link"
                dense
              >
                <q-item-section>
                  {{ link.title }}
                </q-item-section>
              </q-item>
            </template>
            
            <!-- Enlaces de respaldo si no hay enlaces de la API -->
            <template v-if="!loading && navigationItems.length === 0">
              <q-item tag="a" href="/" clickable class="footer-nav-link" dense>
                <q-item-section>Inicio</q-item-section>
              </q-item>
              <q-item tag="a" href="/productos" clickable class="footer-nav-link" dense>
                <q-item-section>Productos</q-item-section>
              </q-item>
              <q-item tag="a" href="/servicios" clickable class="footer-nav-link" dense>
                <q-item-section>Servicios</q-item-section>
              </q-item>
              <q-item tag="a" href="/nosotros" clickable class="footer-nav-link" dense>
                <q-item-section>Sobre Nosotros</q-item-section>
              </q-item>
              <q-item tag="a" href="/contacto" clickable class="footer-nav-link" dense>
                <q-item-section>Contacto</q-item-section>
              </q-item>
            </template>
            
            <!-- Mensaje de debug si hay error (solo visible cuando showDebug es true) -->
            <template v-if="error && showDebug">
              <q-item>
                <q-item-section>
                  <div class="text-negative">Error: {{ error.message }}</div>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
      </div>
      
      <!-- Sección inferior con copyright -->
      <div class="copyright-section">
        <div class="container q-pa-md text-caption text-white">
          <div class="row items-center justify-between">
            <div class="col-12 col-sm-auto text-center text-sm-left">
              {{ new Date().getFullYear() }} CERTIFY. Todos los derechos reservados.
            </div>
            <div class="col-12 col-sm-auto text-center text-sm-right">
              <a href="#" class="q-px-sm text-white">Términos y condiciones</a> | 
              <a href="#" class="q-px-sm text-white">Privacidad</a> | 
              <a href="#" class="q-px-sm text-white">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';

// Obtener la URL base de la API de la configuración de Nuxt
const config = useRuntimeConfig();
const apiBase = config.public.apiBase || 'https://1155-2806-266-480-8244-b06a-3530-343a-1cf.ngrok-free.app';

// Variables para debugging - activar solo en desarrollo
const showDebug = ref(true);

// Estados reactivos
const navigationItems = ref([]);
const loading = ref(true);
const error = ref(null);
const logo = ref('');
const favicon = ref('');
const currentLanguage = ref('es');
const email = ref('');
const phone = ref('');
const address = ref('');
const description = ref('');
const newsletterEmail = ref(''); // Email para el formulario de newsletter

// Activar sólo para depuración - desactivar en producción
// showDebug debe ser false en producción

/**
 * Función para obtener los datos del footer desde la API de Wagtail
 */
/**
 * Función para obtener los datos del footer desde la API
 * Con debugging mejorado para resolver problemas de visualización
 */
const fetchFooterData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Construir la URL con la base correcta de la API
    const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const fullUrl = `${baseUrl}/api/v2/footer`;
    console.log('Fetching footer data from:', fullUrl);
    
    // Intentar obtener datos desde la API
    const { data: response, error: fetchError } = await useFetch(`${baseUrl}/api/v2/footer`, {
      key: 'footer-data-' + Date.now(), 
      timeout: 8000
    });
    
    if (fetchError.value) {
      console.warn(`Error en la solicitud API: ${fetchError.value.message}`);
      // No usar datos estáticos, mostrar los mensajes de error en la interfaz
      navigationItems.value = [];
      logo.value = '';
      favicon.value = '';
    } else if (response.value) {
      // Extraer elementos de navegación del formato exacto proporcionado
      navigationItems.value = response.value.items || [];
      
      // Extraer logo, favicon y otros datos
      logo.value = response.value.logo || '';
      favicon.value = response.value.favicon || '';
      currentLanguage.value = response.value.current_language || 'es';
      
      // Actualizar datos de contacto si vienen en la respuesta
      if (response.value.email) email.value = response.value.email;
      if (response.value.phone) phone.value = response.value.phone;
      if (response.value.address) address.value = response.value.address;
      
      console.log('Footer data loaded successfully:', { 
        links: navigationItems.value.length,
        logo: logo.value,
        favicon: favicon.value
      });
    } else {
      console.error('Error: No data returned');
      // No usar datos estáticos, mostrar los mensajes de error en la interfaz
      navigationItems.value = [];
      logo.value = '';
      favicon.value = '';
      error.value = new Error('No se pudieron cargar los datos del footer');
    }
  } catch (err) {
    console.error('Error al cargar datos del footer:', err);
    error.value = err;
    
    // No usar datos estáticos, mostrar los mensajes de error en la interfaz
    navigationItems.value = [];
    logo.value = '';
    favicon.value = '';
    // Datos de respaldo usando el formato exacto proporcionado
    navigationItems.value = [
      { id: 3, title: 'Inicio', url: '/es/' },
      { id: 11, title: 'Acerca de nosotros', url: '/es/acerca_de/' },
      { id: 21, title: 'Plataforma', url: '/es/plataforma/' },
      { id: 25, title: 'Pacto Verde', url: '/es/pacto_verde/' },
      { id: 5, title: 'Eventos', url: '/es/eventos/' },
      { id: 8, title: 'Noticias', url: '/es/noticias/' },
      { id: 4, title: 'Contacto', url: '/es/contacto/' }
    ];
    logo.value = '/media/original_images/certiffy.png';
    favicon.value = '/media/original_images/wasa.png';
  } finally {
    loading.value = false;
  }
};

/**
 * Función para construir la URL completa del logo desde la API
 */
const getLogo = () => {
  if (!logo.value) return '';
  
  // Si ya es una URL completa
  if (logo.value.startsWith('http')) return logo.value;
  
  // Construir correctamente la URL completa
  const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  const logoPath = logo.value.startsWith('/') ? logo.value : `/${logo.value}`;
  return baseUrl + logoPath;
};

/**
 * Maneja errores de carga de imágenes
 */
const handleImageError = (event) => {
  console.error('Error al cargar imagen:', event.target.src);
  // Marcar la imagen como no válida para usar el respaldo
  event.target.style.display = 'none';
};

/**
 * Función para construir la URL completa del icono de WhatsApp desde la API
 */
const getWhatsappIcon = () => {
  if (!favicon.value) return '';
  
  // Si ya es una URL completa
  if (favicon.value.startsWith('http')) return favicon.value;
  
  // Construir correctamente la URL completa
  const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  const iconPath = favicon.value.startsWith('/') ? favicon.value : `/${favicon.value}`;
  return baseUrl + iconPath;
};

/**
 * Verifica si una URL es válida para mostrar una imagen
 */
const isValidImageUrl = (url) => {
  return url && typeof url === 'string' && url.trim() !== '' && (url.startsWith('http') || url.startsWith('/'));
};

const subscribeNewsletter = () => {
  // Validación básica del email
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    alert('Por favor ingresa un correo electrónico válido');
    return;
  }
  
  // Aquí iría la lógica para suscribir al newsletter
  console.log('Suscribiendo email:', newsletterEmail.value);
  
  // Mostrar feedback al usuario
  alert('¡Gracias por suscribirte a nuestro boletín!');
  newsletterEmail.value = ''; // Limpiar el campo después de enviar
};

// Cargar los enlaces al montar el componente
onMounted(() => {
  fetchFooterData();
  
  // Para debug - Mostrar cuál es la URL base de la API
  console.log('API Base URL:', apiBase);
});
</script>

<style lang="scss" scoped>
/* Estilos generales del footer */
.footer-wrapper {
  width: 100%;
  position: relative;
  min-height: 200px;
  padding-bottom: 20px;
  color: white;
}

/* Contenedor principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Logo estilo */
.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.certify-logo {
  width: 140px;
  height: auto;
  max-height: 60px;
  object-fit: contain;
  display: inline-block;
}

.no-text-decoration {
  text-decoration: none;
}

/* Estilos para el botón flotante de WhatsApp */
.whatsapp-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  /* Animación de pulso */
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

/* Información de contacto */
.contact-info {
  font-size: 14px;
  line-height: 1.6;
}

/* Newsletter input */
.newsletter-input {
  max-width: 300px;
  margin: 0 auto;
  
  ::v-deep .q-field__control {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #fff;
  }
  
  ::v-deep .q-field__native {
    color: #fff !important;
  }
}

/* Enlaces de navegación */
.nav-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-nav-link {
  color: var(--q-accent) !important;
  font-size: 14px;
  padding: 4px 0;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    opacity: 0.9;
    color: var(--q-warning) !important;
  }
}

/* Botón de redes sociales */
.social-btn {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.bg-primary {
    background-color: var(--q-primary) !important;
  }
  
  &.bg-accent {
    background-color: var(--q-accent) !important;
  }
  
  &.bg-secondary {
    background-color: var(--q-secondary) !important;
  }
}

/* Sección de copyright */
.copyright-section {
  margin-top: 30px;
  padding-top: 20px;
}

/* Estilos para títulos en el footer */
h4 {
  font-size: 16px;
  font-weight: 500;
}
</style>
