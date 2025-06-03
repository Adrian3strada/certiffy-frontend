<template>
  <footer class="bg-certiffy-azul">
    <div class="q-py-xl q-px-md">
      <div class="q-mx-auto" style="max-width: 1200px;">
        <div class="row q-col-gutter-md">
          <!-- Logo y copyright -->
          <div class="col-12 col-md-4 column items-start q-gutter-y-md">
            <div>
              <q-img
                src="/images/logo-white.png"
                width="160px"
                height="auto"
                class="q-mb-md"
                fit="contain"
                placeholder-src="/images/logo-placeholder.png"
              >
                <template v-slot:error>
                  <div class="bg-certiffy-azul-claro q-pa-md flex flex-center" style="width: 160px; height: 60px; border-radius: 4px;">
                    <div class="text-h5 text-certiffy-dorado text-weight-bolder" style="font-family: 'OpenSans-ExtraBold', sans-serif;">CERTIFFY</div>
                  </div>
                </template>
              </q-img>
            </div>
            <p class="text-caption q-mb-none text-certiffy-dorado" style="font-family: 'OpenSans-SemiBold', sans-serif;">
              © {{ new Date().getFullYear() }} CERTIFFY. Todos los derechos reservados.
            </p>
          </div>

          <!-- Links de navegación -->
          <div class="col-12 col-md-4 column items-center q-gutter-y-md">
            <div class="text-subtitle1 text-certiffy-dorado q-mb-sm text-weight-bold" style="font-family: 'OpenSans-Bold', sans-serif;">Enlaces</div>
            <div v-if="loading" class="text-center full-width">
              <q-spinner color="white" size="1.5em" />
            </div>
            <div v-else-if="error" class="text-negative">
              <q-icon name="warning" /> Error al cargar enlaces
            </div>
            <div v-else class="column items-center q-gutter-y-sm">
              <q-btn
                v-for="(link, index) in footerLinks"
                :key="index"
                :to="formatLink(link.url)"
                flat
                no-caps
                :label="formatTitle(link.titulo)"
                text-color="white"
                padding="sm md"
                style="font-family: 'OpenSans-SemiBold', sans-serif;"
                class="q-transition"
                :class="{'q-hoverable': true}"
              />
            </div>
          </div>

          <!-- Redes sociales y contacto -->
          <div class="col-12 col-md-4 column items-end q-gutter-y-md">
            <div class="text-subtitle1 text-certiffy-dorado q-mb-sm text-weight-bold text-right" style="font-family: 'OpenSans-Bold', sans-serif;">Síguenos</div>
            <div class="row q-gutter-md justify-end">
              <q-btn round flat color="amber" icon="fab fa-facebook" href="#" target="_blank" class="q-transition" :class="{'q-hoverable': true}" />
              <q-btn round flat color="amber" icon="fab fa-twitter" href="#" target="_blank" class="q-transition" :class="{'q-hoverable': true}" />
              <q-btn round flat color="amber" icon="fab fa-instagram" href="#" target="_blank" class="q-transition" :class="{'q-hoverable': true}" />
              <q-btn round flat color="amber" icon="fab fa-linkedin" href="#" target="_blank" class="q-transition" :class="{'q-hoverable': true}" />
            </div>
            <div class="text-right q-mt-md">
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
    <div class="q-py-sm" style="border-top: 1px solid rgba(223, 187, 67, 0.3);">
      <div class="q-mx-auto" style="max-width: 1200px;">
        <div class="row justify-between items-center q-px-md">
          <div class="col-12 col-md-auto">
            <div class="row q-col-gutter-md q-mt-sm-none q-mt-md">
              <q-btn flat dense no-caps text-color="amber-2" label="Términos y Condiciones" class="text-caption q-transition" :class="{'q-hoverable': true}" style="font-family: 'OpenSans-SemiBold', sans-serif;" to="/terminos" />
              <q-btn flat dense no-caps text-color="amber-2" label="Política de Privacidad" class="text-caption q-transition" :class="{'q-hoverable': true}" style="font-family: 'OpenSans-SemiBold', sans-serif;" to="/privacidad" />
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <p class="text-caption text-amber-2 q-mb-none q-mt-sm-none q-mt-md" style="font-family: 'OpenSans-SemiBold', sans-serif;">
              Desarrollado por <q-btn flat dense padding="xs" no-caps class="text-certiffy-dorado q-transition" :class="{'q-hoverable': true}" style="font-family: 'OpenSans-SemiBold', sans-serif;" label="Equipo CERTIFFY" href="#" />
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


