<template>
  <footer class="bg-primary">
    <div class="q-py-md q-px-md">
      <div class="q-mx-auto" style="max-width: 1200px;">
        <div class="row q-col-gutter-md">
          <!-- Logo y copyright -->
          <div class="col-12 col-md-4 column items-start q-gutter-y-sm">
            <div>
              <q-img
                src="/images/logo-white.png"
                width="120px"
                height="auto"
                class="q-mb-sm"
                fit="contain"
                placeholder-src="/images/logo-placeholder.png"
              >
                <template v-slot:error>
                  <div class="bg-primary-light q-pa-sm flex flex-center" style="width: 120px; height: 45px; border-radius: 4px;">
                    <div class="text-subtitle2 text-warning text-weight-bolder" style="font-family: 'OpenSans-ExtraBold', sans-serif;">CERTIFFY</div>
                  </div>
                </template>
              </q-img>
            </div>
            <p class="text-caption q-mb-none text-warning" style="font-family: 'OpenSans-SemiBold', sans-serif;">
              © {{ new Date().getFullYear() }} CERTIFFY. Todos los derechos reservados.
            </p>
          </div>

          <!-- Links de navegación -->
          <div class="col-12 col-md-4 column items-center q-gutter-y-xs">
            <div class="text-subtitle2 text-warning q-mb-xs text-weight-bold" style="font-family: 'OpenSans-Bold', sans-serif;">Enlaces</div>
            <div v-if="loading" class="text-center full-width">
              <q-spinner color="white" size="1.2em" />
            </div>
            <div v-else-if="error" class="text-negative">
              <q-icon name="warning" size="sm" /> Error al cargar enlaces
            </div>
            <div v-else class="column items-center q-gutter-y-xs">
              <q-btn
                v-for="(link, index) in footerLinks"
                :key="index"
                :to="formatLink(link.url)"
                flat
                dense
                no-caps
                :label="formatTitle(link.titulo)"
                text-color="white"
                padding="xs sm"
                style="font-family: 'OpenSans-SemiBold', sans-serif; font-size: 0.85rem;"
                class="q-transition"
                :class="{'q-hoverable': true}"
              />
            </div>
          </div>

          <!-- Redes sociales y contacto -->
          <div class="col-12 col-md-4 column items-end q-gutter-y-xs">
            <div class="text-subtitle2 text-warning q-mb-xs text-weight-bold text-right" style="font-family: 'OpenSans-Bold', sans-serif;">Síguenos</div>
            <div class="row q-gutter-sm justify-end">
              <q-btn 
                round 
                flat 
                dense 
                color="amber" 
                icon="fab fa-facebook" 
                href="#" 
                target="_blank" 
                class="q-transition" 
                :class="{'q-hoverable': true}"
                size="sm"
              />
              <q-btn 
                round 
                flat 
                dense 
                color="amber" 
                icon="fab fa-twitter" 
                href="#" 
                target="_blank" 
                class="q-transition" 
                :class="{'q-hoverable': true}"
                size="sm"
              />
              <q-btn 
                round 
                flat 
                dense 
                color="amber" 
                icon="fab fa-instagram" 
                href="#" 
                target="_blank" 
                class="q-transition" 
                :class="{'q-hoverable': true}"
                size="sm"
              />
              <q-btn 
                round 
                flat 
                dense 
                color="amber" 
                icon="fab fa-linkedin" 
                href="#" 
                target="_blank" 
                class="q-transition" 
                :class="{'q-hoverable': true}"
                size="sm"
              />
            </div>
            <div class="text-right q-mt-xs">
              <p class="text-caption text-warning q-mb-none q-mt-xs" style="font-family: 'OpenSans-SemiBold', sans-serif; line-height: 1.3;">
                <q-icon name="email" size="xs" class="q-mr-xs" /> info@certiffy.com<br>
                <q-icon name="phone" size="xs" class="q-mr-xs" /> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Segunda sección para términos y políticas -->
    <div class="q-py-xs" style="border-top: 1px solid rgba(223, 187, 67, 0.3);">
      <div class="q-mx-auto" style="max-width: 1200px;">
        <div class="row justify-between items-center q-px-md">
          <div class="col-12 col-md-auto">
            <div class="row q-col-gutter-sm q-mt-xs">
              <q-btn 
                flat 
                dense 
                no-caps 
                text-color="amber-2" 
                label="Términos y Condiciones" 
                class="text-caption q-transition" 
                :class="{'q-hoverable': true}" 
                style="font-family: 'OpenSans-SemiBold', sans-serif;" 
                to="/terminos" 
                padding="xs"
              />
              <q-btn 
                flat 
                dense 
                no-caps 
                text-color="amber-2" 
                label="Política de Privacidad" 
                class="text-caption q-transition" 
                :class="{'q-hoverable': true}" 
                style="font-family: 'OpenSans-SemiBold', sans-serif;" 
                to="/privacidad" 
                padding="xs"
              />
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <p class="text-caption text-amber-2 q-mb-none q-mt-xs" style="font-family: 'OpenSans-SemiBold', sans-serif;">
              Desarrollado por 
              <q-btn 
                flat 
                dense 
                padding="none" 
                no-caps 
                class="text-warning q-transition q-ml-xs" 
                :class="{'q-hoverable': true}" 
                style="font-family: 'OpenSans-SemiBold', sans-serif;" 
                label="Equipo CERTIFFY" 
                href="#" 
              />
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


