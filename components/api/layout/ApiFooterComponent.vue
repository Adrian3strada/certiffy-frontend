<template>
  <!-- Footer con los colores de Quasar de la empresa -->
  <div class="certiffy-footer bg-primary">
    
    <!-- Sección principal del footer -->
    <div class="q-container q-py-xl">
      <div class="row q-col-gutter-lg justify-between">
        
        <!-- Logo y descripción -->
        <div class="col-12 col-md-6 q-py-md">
          <!-- Logo y título desde la API -->
          <div class="text-center text-md-left">
            <a href="/" class="no-text-decoration">
              <div class="row items-center q-mb-md justify-center justify-md-start">
                <img 
                  v-if="logoUrl" 
                  :src="logoUrl" 
                  class="certiffy-footer-logo q-mr-md" 
                  alt="CERTIFY" 
                  @error="handleImageError"
                />
                <span class="text-h5 text-weight-bold text-white">CERTIFY</span>
              </div>
            </a>
          </div>
          
          <!-- Descripción de la plataforma -->
          <p class="certiffy-footer-text text-grey-4 q-py-md">
            {{ description }}
          </p>
          
          <!-- Información de contacto con colores Quasar -->
          <div class="certiffy-footer-text text-grey-4 q-mt-md">
            <div class="q-py-xs">
              <q-icon color="accent" name="location_on" size="sm" class="q-mr-sm" />
              {{ address }}
            </div>
            <div class="q-py-xs">
              <q-icon color="accent" name="email" size="sm" class="q-mr-sm" />
              {{ email }}
            </div>
            <div class="q-py-xs">
              <q-icon color="accent" name="phone" size="sm" class="q-mr-sm" />
              {{ phone }}
            </div>
          </div>
        </div>
        
        <!-- Enlaces rápidos -->
        <div class="col-12 col-md-3 q-py-md">
          <div v-if="columns.length > 0">
            <h4 class="certiffy-footer-title text-grey-4 text-h6 q-mb-md">{{ columns[0].title }}</h4>
            <ul class="certiffy-footer-links">
              <li v-for="(link, linkIndex) in columns[0].links" :key="linkIndex">
                <NuxtLink :to="link.url" class="certiffy-footer-link text-grey-4">{{ link.text }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Redes sociales y Newsletter -->
        <div class="col-12 col-md-3 q-py-md">
          <!-- Sección de redes sociales -->
          <h4 class="certiffy-footer-title text-grey-4 text-h6 q-mb-md">Síguenos en redes sociales</h4>
          
          <!-- Iconos de redes sociales -->
          <div class="certiffy-social-icons q-mb-lg">
            <a :href="getSocialUrl('facebook')" target="_blank" class="certiffy-social-icon" aria-label="Facebook">
              <q-icon name="fab fa-facebook-f" size="md" color="accent" />
            </a>
            <a :href="getSocialUrl('twitter')" target="_blank" class="certiffy-social-icon" aria-label="Twitter">
              <q-icon name="fab fa-twitter" size="md" color="accent" />
            </a>
            <a :href="getSocialUrl('instagram')" target="_blank" class="certiffy-social-icon" aria-label="Instagram">
              <q-icon name="fab fa-instagram" size="md" color="accent" />
            </a>
            <a :href="getSocialUrl('linkedin')" target="_blank" class="certiffy-social-icon" aria-label="LinkedIn">
              <q-icon name="fab fa-linkedin-in" size="md" color="accent" />
            </a>
            <a :href="getSocialUrl('youtube')" target="_blank" class="certiffy-social-icon" aria-label="YouTube">
              <q-icon name="fab fa-youtube" size="md" color="accent" />
            </a>
          </div>
          
          <!-- Newsletter -->
          <h4 class="certiffy-footer-title text-grey-4 text-h6 q-mb-md">Suscríbete a nuestro boletín</h4>
          
          <!-- Input de suscripción -->
          <q-input 
            v-model="newsletterEmail" 
            outlined 
            dense
            placeholder="Tu correo electrónico" 
            dark
            class="newsletter-input"
          />

          <!-- Botón de suscripción a newsletter -->
          <div class="q-mt-sm">
            <q-btn no-caps color="warning" label="Suscribirse" icon="send" @click="subscribeNewsletter" class="q-mt-sm" />
          </div>
        </div>
      </div>
      
      <!-- Copyright y enlaces legales -->
      <div class="row justify-center q-py-md">
        <div class="col-12 text-center text-grey-6">
          <p class="q-mb-none">
            &copy; {{ new Date().getFullYear() }} CERTIFY. Todos los derechos reservados.
            <span class="footer-legal-links">
              <NuxtLink to="/terminos-y-condiciones" class="text-grey-6 q-ml-md">Términos y condiciones</NuxtLink>
              <span class="q-mx-xs">|</span>
              <NuxtLink to="/aviso-de-privacidad" class="text-grey-6">Aviso de privacidad</NuxtLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFooter } from '~/composables/useFooter';

// Usar el composable para obtener los datos del footer
// Usar el composable de footer con logs detallados
const { footerData, logoUrl, faviconUrl, footerItems, isLoading: loading, error } = useFooter();

// Logs para depurar datos recibidos
console.log('ApiFooterComponent - logoUrl:', logoUrl.value);
console.log('ApiFooterComponent - faviconUrl:', faviconUrl.value);
console.log('ApiFooterComponent - footerItems:', JSON.stringify(footerItems.value, null, 2));
console.log('ApiFooterComponent - footerData:', JSON.stringify(footerData, null, 2));
const showDebug = ref(process.env.NODE_ENV === 'development');

// Valor para modelo de newsletter
const newsletterEmail = ref('');

// Computed properties para acceder a los datos del footer
const socialNetworks = computed(() => footerData.footer?.social_networks || {});

// Transformar los items planos en columnas para el layout
const columns = computed(() => {
  if (!footerItems.value || footerItems.value.length === 0) return [];
  
  // Dividir los items en dos columnas para el footer
  const halfLength = Math.ceil(footerItems.value.length / 2);
  
  return [
    {
      title: 'Enlaces rápidos',
      links: footerItems.value.slice(0, halfLength).map(item => ({
        title: item.title,
        url: item.url,
        text: item.title
      }))
    },
    {
      title: 'Servicios',
      links: footerItems.value.slice(halfLength).map(item => ({
        title: item.title,
        url: item.url,
        text: item.title
      }))
    }
  ];
});

// Datos estáticos de respaldo (se usarán si no hay datos de la API)
const description = computed(() => 
  footerData.footer?.description || 'Plataforma integral de trazabilidad y certificación para cadenas de suministro sostenibles.'
);
const address = computed(() => 
  footerData.footer?.address || 'Calle Principal 123, Ciudad'
);
const email = computed(() => 
  footerData.footer?.email || 'info@certify.com'
);
const phone = computed(() => 
  footerData.footer?.phone || '+1 (555) 123-4567'
);



/**
 * Maneja errores de carga de imágenes
 */
const handleImageError = (event) => {
  console.error('Error al cargar imagen:', event.target.src);
  // Marcar la imagen como no válida para usar el respaldo
  event.target.style.display = 'none';
};

/**
 * Obtiene la URL de una red social desde los datos del API o usa un valor predeterminado
 */
const getSocialUrl = (network) => {
  // Si hay datos de redes sociales en el API, usarlos
  if (socialNetworks.value && socialNetworks.value[network]) {
    return socialNetworks.value[network];
  }
  
  // Valores predeterminados como respaldo
  const defaultUrls = {
    facebook: 'https://facebook.com/certify',
    twitter: 'https://twitter.com/certify',
    instagram: 'https://instagram.com/certify',
    linkedin: 'https://linkedin.com/company/certify',
    youtube: 'https://youtube.com/c/certify'
  };
  
  return defaultUrls[network] || '#';
};

/**
 * Función para suscribir a newsletter
 */
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

</script>

<style lang="scss" scoped>
/* Estilos generales del footer */
.certiffy-footer {
  width: 100%;
  position: relative;
  padding: 60px 0 0;
  color: white;
}

/* Contenedor principal */
.q-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Logo estilo */
.certiffy-footer-logo {
  width: auto;
  height: 50px;
  object-fit: contain;
}

.no-text-decoration {
  text-decoration: none;
}

/* Textos del footer */
.certiffy-footer-text {
  font-size: 16px;
  line-height: 1.6;
}

.certiffy-footer-title {
  font-weight: 500;
  margin-bottom: 20px;
}

/* Enlaces del footer */
.footer-links {
  padding-left: 0;
}

.certiffy-footer-link {
  color: #bbb !important;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: white !important;
  }
}

/* Newsletter input */
.newsletter-input {
  max-width: 100%;
  margin-bottom: 10px;
  
  :deep(.q-field__control) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  :deep(.q-field__native) {
    color: white;
  }
}

/* Estilos para iconos de redes sociales */
.certiffy-social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.certiffy-social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  color: var(--q-accent);
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.certiffy-social-icon:hover {
  background-color: var(--q-accent);
  color: white !important;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.certiffy-social-icon .q-icon {
  font-size: 1.2rem;
}

/* Sección de copyright */
.certiffy-footer-copyright {
  font-size: 14px;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 767px) {
  .certiffy-footer {
    padding-top: 40px;
  }
  
  .certiffy-footer-logo {
    height: 40px;
    margin-bottom: 10px;
  }
}
</style>
