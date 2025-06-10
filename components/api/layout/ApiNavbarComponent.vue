<template>
  <header class="bg-primary text-white q-py-sm shadow-2 fixed-top" style="z-index: 1000">
    <div class="q-px-md q-px-sm-lg q-mx-auto" style="max-width: 1200px; width: 100%">
      <div class="row full-width items-center justify-between no-wrap">
        <!-- Logo con imagen y texto -->
        <div 
          class="col-4 text-warning q-transition cursor-pointer row items-center logo-container q-mr-md" 
          style="font-family: 'OpenSans-ExtraBold', sans-serif; font-size: 1.6rem;"
          @click="navigateToHome"
        >
          <!-- Imagen de logo obtenido dinámicamente de la API usando proxy -->
          <img 
            v-if="logoUrl"
            :src="`/api/proxy-image?url=${encodeURIComponent(logoUrl)}`" 
            width="65px" 
            height="45px"
            class="q-mr-xs"
            style="margin-right: 5px;"
          />
          CERTIFFY
        </div>
        
        <!-- Menú de navegación para pantallas medianas y grandes con submenús -->
        <div class="col-9 gt-sm main-nav-container">
          <q-toolbar class="main-navbar q-mx-md">
            <!-- Botón de inicio siempre presente -->
            <q-btn 
              label="Inicio"
              to="/es/"
              flat
              no-caps
              :class="{
                'main-nav-item text-white home-button': true,
                'active-route': isActiveRoute('/es/') || isActiveRoute('/')
              }"
              style="font-family: 'OpenSans-SemiBold', sans-serif;"
            />
            
            <!-- Enlaces de nivel principal -->
            <template v-for="(menuItem, idx) in processedNavItems" :key="idx">
              <!-- Si tiene hijos, mostrar como dropdown -->
              <q-btn-dropdown 
                v-if="menuItem.children && menuItem.children.length > 0 && menuItem.title !== 'Inicio'"
                :label="menuItem.title"
                flat 
                no-caps
                dropdown-icon="expand_more"
                :class="{
                  'main-nav-item text-white': true,
                  'active-route': isActiveRoute(menuItem.url)
                }"
                auto-close
              >
                <q-list class="bg-dark dropdown-submenu">
                  <q-item
                    v-for="(subItem, subIdx) in menuItem.children" 
                    :key="subIdx"
                    :to="normalizeUrl(subItem.url)"
                    clickable
                    v-close-popup
                    class="text-white submenu-item"
                    v-ripple
                  >
                    <q-item-section>
                      <q-item-label>{{ subItem.title }}</q-item-label>
                    </q-item-section>
                    
                    <!-- Submenú de tercer nivel si existe -->
                    <template v-if="subItem.children && subItem.children.length > 0">
                      <q-item-section side>
                        <q-icon name="chevron_right" />
                      </q-item-section>
                    </template>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              
              <!-- Enlace simple sin hijos -->
              <q-btn
                v-else
                :label="menuItem.title"
                :to="normalizeUrl(menuItem.url)"
                flat
                no-caps
                :class="{
                  'main-nav-item text-white': true,
                  'active-route': isActiveRoute(menuItem.url)
                }"
              />
            </template>
          </q-toolbar>
        </div>
        
        <!-- Botón de contacto WhatsApp y selector de idioma (esquina superior) -->
        <div class="absolute-top-right q-ma-sm row no-wrap items-center">
          <!-- Selector de idioma -->
          <q-btn-dropdown
            v-if="availableLanguages.length > 1"
            color="accent"
            class="q-mr-sm language-selector"
            :label="currentLanguage.toUpperCase()"
            dense
            no-caps
            size="sm"
            rounded
          >
            <q-list>
              <q-item 
                v-for="lang in availableLanguages" 
                :key="lang.code"
                clickable
                v-close-popup
                @click="changeLanguage(lang.code)"
                :active="currentLanguage === lang.code"
              >
                <q-item-section>
                  <q-item-label>{{ lang.display_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- Botón de WhatsApp -->
          <q-btn 
            class="text-white bg-positive shadow-1 contact-btn q-hoverable q-transition"
            icon="mdi-whatsapp"
            label="Contáctanos"
            no-caps
            rounded
            size="md"
            dense
            @click="contactWhatsApp"
          />
        </div>
        
        <!-- Botón de menú para móviles -->
        <div class="col-auto lt-md">
          <q-btn
            flat
            round
            color="accent"
            icon="menu"
            @click="drawerOpen = !drawerOpen"
          />
        </div>
      </div>
    </div>
    
    <!-- Drawer para móviles -->
    <q-drawer
      v-model="drawerOpen"
      side="right"
      bordered
      :width="drawerWidth"
      :breakpoint="1024"
      class="bg-primary text-white"
    >
      <q-scroll-area class="fit">
        <q-list padding class="drawer-list">
          <q-item-label header class="text-warning q-mt-md q-mb-md" style="font-family: 'OpenSans-ExtraBold', sans-serif;">CERTIFFY</q-item-label>
          
          <q-separator spaced dark />
          
          <!-- Elementos de menú en el drawer -->
          <template v-for="(menuItem, idx) in processedNavItems" :key="idx">
            <!-- Si tiene submenús -->
            <template v-if="menuItem.children && menuItem.children.length > 0">
              <q-expansion-item
                :label="menuItem.title"
                :header-class="'text-warning drawer-parent-item'"
                expand-separator
                icon="expand_more"
                dark
                style="font-family: 'OpenSans-SemiBold', sans-serif;"
              >
                <q-list class="q-pl-md">
                  <q-item
                    v-for="(subItem, subIdx) in menuItem.children"
                    :key="subIdx"
                    :to="normalizeUrl(subItem.url)"
                    clickable
                    v-close-popup
                    class="drawer-item"
                  >
                    <q-item-section>
                      <q-item-label class="text-warning" style="font-family: 'OpenSans-SemiBold', sans-serif;">{{ subItem.title }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </template>
            <!-- Si no tiene submenús -->
            <q-item
              v-else
              :to="normalizeUrl(menuItem.url)"
              clickable
              v-close-popup
              class="text-white q-hoverable q-transition"
              v-ripple
            >
              <q-item-section>
                <q-item-label class="drawer-item-label text-warning" style="font-family: 'OpenSans-SemiBold', sans-serif;">{{ menuItem.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useWagtailApi } from '~/composables/useWagtailApi';
import { useRuntimeConfig } from '#app';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { getDataFromUrl, normalizeUrl } = useWagtailApi();

const props = defineProps({
  navbarEndpoint: {
    type: String,
    default: '/api/proxy-wagtail?url=/api/v2/pages/'
  }
});

// Variables reactivas
const drawerOpen = ref(false);
const menuItems = ref([]);
const navItems = ref([]);
const logoUrl = ref(null);
const isLoading = ref(true);
const error = ref(null);
const activeTab = ref(0);
const windowWidth = ref(1024);

// Variables para el selector de idiomas
const currentLanguage = ref('es'); // Idioma por defecto
const availableLanguages = ref([]);

// Procesar elementos de navegación
const processedNavItems = computed(() => {
  // Si el navbar tiene una estructura anidada donde todos los elementos están bajo 'Inicio'
  if (navItems.value.length === 1 && navItems.value[0].title === 'Inicio' && navItems.value[0].children) {
    // Extraer los elementos hijos de 'Inicio' y mostrarlos como elementos principales
    return navItems.value[0].children;
  }
  return navItems.value;
});

// Ancho del drawer responsivo
const drawerWidth = computed(() => {
  return windowWidth.value < 400 ? 200 : 250;
});

// Manejar cambio de tamaño de ventana
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Función para obtener datos de navegación
const fetchNavItems = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const pagesData = await getDataFromUrl('/api/v2/pages/');
    console.log('Datos recibidos del API:', pagesData);
    
    if (pagesData && pagesData.navbar) {
      // Extraer los elementos de navegación
      const extractedNavItems = pagesData.navbar.length === 1 && pagesData.navbar[0].children
        ? pagesData.navbar[0].children
        : pagesData.navbar;

      navItems.value = extractedNavItems;
      menuItems.value = extractedNavItems;
      console.log('Menú cargado correctamente:', menuItems.value.length, 'elementos');
    } else {
      console.error('No se encontraron datos de navegación en la respuesta de la API', pagesData);
      // Fallback de navegación básica
      const fallbackItems = [
        { title: 'Inicio', url: '/' },
        { title: 'Acerca de', url: '/acerca/' },
        { title: 'Servicios', url: '/servicios/' },
        { title: 'Contacto', url: '/contacto/' },
      ];
      navItems.value = fallbackItems;
      menuItems.value = fallbackItems;
      error.value = 'No se pudieron cargar los items de navegación';
    }
    
    // Extraer el logo si está disponible
    if (pagesData && pagesData.logo) {
      logoUrl.value = pagesData.logo;
      console.log('Logo cargado:', logoUrl.value);
    }
    
    // Extraer la información de idiomas
    if (pagesData && pagesData.current_language) {
      currentLanguage.value = pagesData.current_language;
      console.log('Idioma actual:', currentLanguage.value);
    }
    
    if (pagesData && pagesData.available_languages) {
      availableLanguages.value = pagesData.available_languages;
      console.log('Idiomas disponibles:', availableLanguages.value);
    }
  } catch (err) {
    console.error('Error al cargar datos de navegación:', err);
    error.value = `Error: ${err.message || 'No se pudieron cargar los datos'}`;
    
    // Establecer menú de respaldo
    const fallbackItems = [
      { title: 'Inicio', url: '/' },
      { title: 'Acerca de', url: '/acerca/' },
      { title: 'Contacto', url: '/contacto/' },
    ];
    navItems.value = fallbackItems;
    menuItems.value = fallbackItems;
  } finally {
    isLoading.value = false;
  }
};

// Función para cambiar de idioma
const changeLanguage = async (langCode) => {
  try {
    // Solo cambiar si es un idioma diferente al actual
    if (langCode !== currentLanguage.value) {
      console.log(`Cambiando idioma a: ${langCode}`);
      
      // Obtener la URL correspondiente para el idioma seleccionado
      const newUrl = `/api/v2/pages/?locale=${langCode}`;
      const newPagesData = await getDataFromUrl(newUrl);
      
      if (newPagesData && newPagesData.items && newPagesData.items.length > 0) {
        // Actualizar estado local
        currentLanguage.value = langCode;
        
        // Buscar la página principal (home) o la página equivalente para el nuevo idioma
        let targetPage = null;
        
        // 1. Primero intentamos encontrar la página del mismo tipo en el nuevo idioma
        const currentPathSegments = route.path.split('/').filter(Boolean);
        const currentPageSlug = currentPathSegments.length > 0 ? currentPathSegments[currentPathSegments.length - 1] : '';
        
        if (currentPageSlug) {
          // Buscar página con slug similar
          targetPage = newPagesData.items.find(item => 
            item.meta?.slug === currentPageSlug ||
            (item.meta?.html_url && item.meta.html_url.includes(`/${currentPageSlug}/`)));
        }
        
        // 2. Si no encontramos una página equivalente, usar la home
        if (!targetPage) {
          targetPage = newPagesData.items.find(item => 
            item.meta?.type === 'home.HomePage' ||
            (item.meta?.html_url && item.meta.html_url.endsWith(`/${langCode}/`)));
        }
        
        // 3. Determinar la URL adecuada para el nuevo idioma
        let newPath = `/${langCode}/`; // Por defecto ir a la raíz del idioma
        
        if (targetPage?.meta?.html_url) {
          const urlObj = new URL(targetPage.meta.html_url);
          newPath = urlObj.pathname;
        }
        
        // 4. Guardar la configuración del idioma actual para la próxima carga
        localStorage.setItem('currentLanguage', langCode);
        
        // 5. Emitir un evento personalizado para notificar al sistema del cambio de idioma
        window.dispatchEvent(new CustomEvent('language-changed', {
          detail: { language: langCode }
        }));
        
        // 6. Forzar una recarga completa para que se reconstruyan las rutas con los IDs correctos
        console.log(`Navegando a nueva URL con idioma ${langCode}: ${newPath}`);
        window.location.href = newPath;
      }
    }
  } catch (error) {
    console.error('Error al cambiar el idioma:', error);
  }
};

// Encontrar la pestaña activa basada en la ruta actual
const findActiveTab = () => {
  if (!menuItems.value || menuItems.value.length === 0) return;
  
  const currentPath = route.path;
  
  // Buscar la coincidencia más cercana en el menú
  for (let i = 0; i < menuItems.value.length; i++) {
    const item = menuItems.value[i];
    if (isActiveRoute(item.url)) {
      activeTab.value = i;
      return;
    }
    
    // Buscar en los hijos también
    if (item.children) {
      for (const child of item.children) {
        if (isActiveRoute(child.url)) {
          activeTab.value = i;
          return;
        }
      }
    }
  }
  
  // Si no se encuentra coincidencia, usar 0 (inicio)
  activeTab.value = 0;
};

// Actualizar la pestaña activa basada en la ruta
const updateActiveTab = (path) => {
  if (!processedNavItems.value.length) return;
  
  // Primero buscar coincidencia exacta
  const exactMatch = processedNavItems.value.find(item => item.url === path);
  if (exactMatch) {
    activeTab.value = exactMatch.url;
    return;
  }
  
  // Si no hay coincidencia exacta, buscar en hijos
  for (const item of processedNavItems.value) {
    if (item.children && item.children.length) {
      const childMatch = item.children.find(child => child.url === path);
      if (childMatch) {
        activeTab.value = item.url; // Activar el padre
        return;
      }
    }
  }
  
  // Si aún no hay coincidencia, buscar coincidencia parcial
  const partialMatch = processedNavItems.value.find(item => path.startsWith(item.url) && item.url !== '/');
  if (partialMatch) {
    activeTab.value = partialMatch.url;
    return;
  }
  
  // Si no hay coincidencia, usar el primer elemento
  activeTab.value = processedNavItems.value[0]?.url || '/';
};

// Verificar si una ruta está activa (para resaltado)
function isActiveRoute(url) {
  if (!url) return false;
  
  const currentPath = route.path;
  const normalizedCurrentPath = normalizeUrl(currentPath);
  const normalizedUrl = normalizeUrl(url);
  
  // Ruta raíz es caso especial
  if (normalizedUrl === '/' && normalizedCurrentPath === '/') {
    return true;
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  // Rutas de idioma principal (e.g. /es/ o /en/) son casos especiales
  if (normalizedCurrentPath.match(/^\/[a-z]{2}\/?$/) && normalizedUrl.match(/^\/[a-z]{2}\/?$/)) {
    return normalizedCurrentPath === normalizedUrl;
  }
  
  // Considerar la ruta actual como activa si:
  // - coincide exactamente
  // - o si la URL de navegación es parte de la URL actual (para subpáginas)
  return normalizedCurrentPath === normalizedUrl || 
         (normalizedUrl !== '/' && normalizedUrl !== '/es/' && 
          normalizedUrl !== '/en/' && normalizedCurrentPath.startsWith(normalizedUrl));
}

// Función para contacto WhatsApp
function contactWhatsApp() {
  const phoneNumber = '1234567890'; // Reemplazar con el número correcto
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hola,%20me%20gustaría%20más%20información%20sobre%20Certiffy`;
  window.open(whatsappUrl, '_blank');
}

// Función para navegar al inicio
function navigateToHome() {
  const lang = currentLanguage.value || 'es';
  router.push(`/${lang}/`);
}

// Lifecycle hooks
onMounted(() => {
  // Verificar si hay un idioma guardado en el almacenamiento local
  const savedLanguage = localStorage.getItem('currentLanguage');
  if (savedLanguage) {
    console.log(`Idioma guardado encontrado: ${savedLanguage}`);
    currentLanguage.value = savedLanguage;
  }
  
  // Cargar elementos de navegación
  fetchNavItems();
  
  // Encontrar la pestaña activa
  findActiveTab();
  
  // Añadir event listener para cambios de tamaño de ventana
  window.addEventListener('resize', handleResize);
  handleResize(); // Inicializar el ancho
});

onUnmounted(() => {
  // Eliminar event listener para evitar memory leaks
  window.removeEventListener('resize', handleResize);
});

// Watchers
watch(
  () => route.path,
  () => {
    findActiveTab();
  }
);
</script>

<style scoped>
/* Selector de idiomas */
.language-selector {
  font-size: 0.8rem;
  min-width: 40px;
  transition: all 0.3s ease;
}

.language-selector:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Estilos para la barra de navegación */
.main-nav-container {
  display: flex;
  width: 100%;
  justify-content: center;
}

.main-navbar {
  background: transparent;
  padding: 0;
}

.main-nav-item {
  font-family: 'OpenSans-SemiBold', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 10px;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: 0 2px;
  position: relative;
}

/* Estilo para ruta activa */
.active-route {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: var(--q-warning) !important;
  position: relative;
}

.active-route::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: var(--q-warning);
  border-radius: 2px;
}

.main-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--q-warning) !important;
}

/* Estilos para submenús */
.dropdown-submenu {
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.submenu-item {
  font-family: 'OpenSans-SemiBold', sans-serif;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background-color: var(--q-primary-darkened);
  color: var(--q-warning) !important;
}

/* Estilos para el botón de contacto */
.contact-btn {
  font-family: 'OpenSans-SemiBold', sans-serif;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: scale(1.05);
}

/* Ajustar los estilos del drawer para móviles */
.drawer-item-label {
  font-size: 1.1rem;
}

.drawer-parent-item {
  font-weight: 600;
}

/* Estilo para elementos activos */
.router-link-active .main-nav-item,
.router-link-exact-active .main-nav-item {
  color: var(--q-warning) !important;
  font-weight: 700;
}

/* Responsividad */
@media (max-width: 1024px) {
  .main-nav-container {
    display: none;
  }
}
</style>