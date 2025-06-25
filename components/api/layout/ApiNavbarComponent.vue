
<template>
 <header class="bg-primary text-white shadow-2 fixed-top z-top">
    <!-- contenedor centrado -->
    <div class="q-px-md q-px-sm-lg q-mx-auto" style="max-width:1200px;width:100%">

      <!-- === COLUMNA: acciones + barra principal ====================== -->
      <div class="column full-width">

        <!-- 1▸ FILA de acciones (desktop) -->
        <div class="row items-center justify-end q-gutter-xs q-pt-xs gt-sm">
          <!-- selector de idioma -->
          <q-btn-dropdown
            icon="language" color="accent"
            size="md" 
            no-caps
            class="language-selector"
            :label="getLanguageDisplayName(currentLanguage)"
            :loading="isChangingLanguage"
            :disable="isChangingLanguage"
          >
            <q-list>
              <q-item v-for="lang in availableLanguages"
                      :key="lang.code||lang"
                      clickable v-close-popup
                      @click="changeLanguage(lang.code||lang)">
                <q-item-section>
                  {{ getLanguageDisplayName(lang.code||lang) }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- botón WhatsApp -->
          <q-btn
            size="md" 
            no-caps
            color="green" icon="mdi-whatsapp"
            label="Contáctanos"
            class="certiffy-contact-button"
            @click="contactWhatsApp"
          />
        </div>

        <!-- 2▸ FILA principal: logo + menú + hamburguesa -->
        <div class="row items-center no-wrap">

          <!-- logo (3 col xl-lg · 4 col md) -->
          <div
            class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-xs-6
                   row items-center cursor-pointer q-gutter-xs"
            @click="navigateToHome"
          >
            <img v-if="logoUrl"
                 :src="logoUrl"
                 style="height:48px;width:auto"
                 alt="Logo"
                 class="q-mr-xs"
                 @error="handleImageError" />
            <span class="text-weight-bold text-h5">CERTIFY</span>
          </div>

          <!-- menú (7 col xl-lg · 5 col md) -->
          <div
            class="col-xl-7 col-lg-7 col-md-5 col-sm-12 col-xs-12
                   row items-center no-wrap q-gutter-md gt-sm"
          >
    
            <template v-for="(menuItem,idx) in processedNavItems" :key="idx">
              <!-- enlace simple -->
              <q-btn
                v-if="!menuItem.children?.length || menuItem.title==='Inicio'"
                :label="menuItem.title"
                :to="normalizeUrl(menuItem.url)"
                flat no-caps
                class="navbar-link text-weight-600 text-white"
                :class="{ 'bg-white-2': isActiveRoute(menuItem.url) }"
              />
              <!-- dropdown -->
              <q-btn-dropdown
                v-else
                :label="menuItem.title"
                flat no-caps auto-close
                dropdown-icon="expand_more"
                class="navbar-link text-weight-600 text-white"
                :class="{ 'navbar-active-indicator': isActiveRoute(menuItem.url) }"
              >
                <q-list class="bg-dark shadow-5">
                  <q-item
                    v-for="sub in menuItem.children"
                    :key="sub.title"
                    :to="normalizeUrl(sub.url)"
                    clickable v-close-popup
                    class="text-white text-weight-600"
                    :class="{ 'bg-white-1': isActiveRoute(normalizeUrl(sub.url)) }"
                  >
                    <q-item-section>{{ sub.title }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </template>
          </div>

 
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
      class="certiffy-navbar-drawer bg-primary text-white"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-warning q-mt-md q-mb-md certiffy-navbar-drawer-header">CERTIFFY</q-item-label>
          
          <q-separator spaced dark />
          
          <!-- Elementos de menú en el drawer -->
          <template v-for="(menuItem, idx) in processedNavItems" :key="idx">
            <!-- Si tiene submenús -->
            <template v-if="menuItem.children && menuItem.children.length > 0">
              <q-expansion-item
                :label="menuItem.title"
                :header-class="'text-warning certiffy-navbar-drawer-item'"
                expand-separator
                icon="expand_more"
                dark
              >
                <q-list class="q-pl-md">
                  <q-item
                    v-for="(subItem, subIdx) in menuItem.children"
                    :key="subIdx"
                    :to="normalizeUrl(subItem.url)"
                    clickable
                    v-close-popup
                    class="certiffy-navbar-drawer-item"
                  >
                    <q-item-section>
                      <q-item-label class="text-warning">{{ subItem.title }}</q-item-label>
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
              class="text-white certiffy-navbar-drawer-item"
              v-ripple
            >
              <q-item-section>
                <q-item-label class="text-warning">{{ menuItem.title }}</q-item-label>
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
import { useNavbar } from '~/composables/useNavbar';
import { useLocales } from '~/composables/useLocales';
import { useWagtail } from '~/composables/useWagtail';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();



// Variables reactivas para el componente
const drawerOpen = ref(false);

// Usar los composables para los datos de navegación y localización
// Usar el composable de navbar con logs detallados
const { navbarData, logoUrl, navItems, isLoading: loading, error, refresh: fetchNavbar } = useNavbar();

// Logs para depurar datos recibidos
// console.log('ApiNavbarComponent - logoUrl:', logoUrl.value);
// console.log('ApiNavbarComponent - navItems:', JSON.stringify(navItems.value, null, 2));
// console.log('ApiNavbarComponent - navbarData:', JSON.stringify(navbarData, null, 2));
const { localesData, isLoading: loadingLocales } = useLocales();

// Computed properties para obtener los datos
const homeUrl = ref('/');

// Ya no necesitamos definir navItems localmente, lo usamos directamente del composable

// Variables para el idioma
// Usar current_language del navbar si existe, si no usar del composable locales
const currentLanguage = computed(() => navbarData.navbar?.current_language || localesData.currentLocale || 'es');

// Siempre tener al menos español e inglés disponibles
const defaultLanguages = [
  { code: 'es', display_name: 'Español' },
  { code: 'en', display_name: 'English' }
];

// Asegurar que siempre haya idiomas disponibles
const availableLanguages = computed(() => {
  // Usar los idiomas de la API si existen
  const apiLanguages = localesData.locales || [];
  
  // Si no hay idiomas de la API, usar los predeterminados
  if (!apiLanguages.length) {
    // console.log('Usando idiomas predeterminados porque la API no devolvió ninguno');
    return defaultLanguages;
  }
  
  return apiLanguages;
});

// Variables para manejo de tamaño de pantalla
const windowWidth = ref(1024);
const activeTab = ref(0);

// Ancho del drawer responsivo
const drawerWidth = computed(() => {
  return windowWidth.value < 400 ? 200 : 250;
});

// Procesar los elementos de navegación para el menú
const processedNavItems = computed(() => {
  // Si está cargando o hay un error, devolver un array vacío
  if (loading.value || error.value) return [];
  
  // Verificar si hay datos de navegación
  if (!navItems.value || !navItems.value.length) return [];
  
  // console.log('Procesando elementos de navegación:', JSON.stringify(navItems.value, null, 2));
  
  // En la estructura actual de la API, navItems.value es un array que contiene un único elemento
  // que a su vez tiene un array de children que son los elementos principales del menú
  if (navItems.value[0]) {
    // Crear un array que incluya tanto el elemento raíz como sus hijos
    const rootItem = {
      title: navItems.value[0].title || 'Inicio',
      url: navItems.value[0].url || '/',
      children: []
    };
    
    // Procesar los hijos del elemento raíz
    const childrenItems = Array.isArray(navItems.value[0].children) 
      ? navItems.value[0].children.map(item => ({
          title: item.title || 'Enlace',
          url: item.url || '/',
          children: item.children || []
        }))
      : [];
    
    // Combinar el elemento raíz y sus hijos en un solo array
    const menuItems = [rootItem, ...childrenItems];
    
    // console.log('Elementos procesados (con raíz):', JSON.stringify(menuItems, null, 2));
    return menuItems;
  }
  
  // Si la estructura no es la esperada, intentar procesar el array directamente
  const menuItems = navItems.value.map(item => ({
    title: item.title || 'Enlace',
    url: item.url || '/',
    children: item.children || []
  }));
  
  // console.log('Elementos procesados (fallback):', JSON.stringify(menuItems, null, 2));
  return menuItems;
});

// Normalizar URL para links
const normalizeUrl = (url) => {
  if (!url) return '/';
  
  // Si la URL es absoluta y no pertenece a nuestro dominio, mantenerla como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Para URLs relativas, asegurarse de que comiencen con /
  return url.startsWith('/') ? url : `/${url}`;
};

// Manejar cambio de tamaño de ventana
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Función para cambiar de idioma
async function changeLanguage(langCode) {
  if (langCode === currentLanguage.value) return;
  
  // Hacemos un seguimiento del idioma anterior
  const previousLanguage = currentLanguage.value;
  
  try {
    // console.log(`Cambiando idioma de ${previousLanguage} a ${langCode}...`);
    localStorage.setItem('currentLocale', langCode); // Usamos currentLocale para mantener coherencia con el composable
    
    // Limpiar todas las cachés para forzar la recarga de los datos en el nuevo idioma
    const wagtailUtils = useWagtail();
    wagtailUtils.clearCaches();
    // console.log('Cachés de páginas limpiadas para el cambio de idioma');
    
    // Actualizar el navbar con los elementos del nuevo idioma
    // Esto asegura que los elementos del menú se actualicen inmediatamente sin necesidad de recargar la página
    try {
      // Llamar a fetchNavbar con el nuevo idioma para actualizar los datos del navbar
      await fetchNavbar(langCode);
      // console.log(`Navbar actualizado para idioma ${langCode}`);
    } catch (navbarError) {
      // console.error(`Error al actualizar navbar para idioma ${langCode}:`, navbarError);
      // Continuar con la navegación a pesar del error
    }
    
    // Obtener la ruta actual
    const currentPath = route.path;
    let newPath;
    
    // Detectar si estamos en la página de inicio o en una ruta con prefijo de idioma
    const isHomePage = currentPath === '/' || 
                      currentPath === `/${previousLanguage}` || 
                      currentPath === `/${previousLanguage}/`;
                      
    const hasLanguagePrefix = /^\/[a-z]{2}($|\/)/i.test(currentPath);
    
    // Si estamos en la página de inicio, ir a la raíz del nuevo idioma
    if (isHomePage) {
      newPath = `/${langCode}`;
      // console.log(`Página de inicio detectada, cambiando a: ${newPath}`);
    }
    // Si la ruta tiene prefijo de idioma, extraer la parte después del prefijo
    else if (hasLanguagePrefix) {
      // Extraer la parte de la ruta después del prefijo de idioma
      const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/i, '/');
      if (pathWithoutLang === '/') {
        // Si solo era el prefijo de idioma, ir a la raíz del nuevo idioma
        newPath = `/${langCode}`;
      } else {
        // Agregar el nuevo prefijo de idioma
        newPath = `/${langCode}${pathWithoutLang}`;
      }
      // console.log(`Ruta con prefijo de idioma detectada, cambiando a: ${newPath}`);
    }
    // Para otras rutas sin prefijo de idioma
    else {
      newPath = `/${langCode}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;
      // console.log(`Otra ruta detectada, cambiando a: ${newPath}`);
    }
    
    // Asegurarse de que la nueva ruta comienza con / y no tiene dobles slashes
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }
    newPath = newPath.replace(/\/\//g, '/');
    
    // console.log(`Navegando a nueva ruta: ${newPath}`);
    
    // Actualizar la ruta usando el router
    await router.push(newPath);
    
    // Forzar recarga de la página para asegurar que se carguen los nuevos datos
    if (process.client) {
      window.location.href = newPath;
    }
    
    // console.log(`Idioma cambiado a ${langCode}`);
  } catch (err) {
    // Si hay un error, revertir al idioma anterior
    // console.error('Error al cambiar de idioma:', err);
  }
}

// Verificar si una ruta está activa (para resaltado)
function isActiveRoute(url) {
  if (!url) return false;
  
  const currentPath = route.path;
  const normalizedCurrentPath = normalizeUrl(currentPath);
  const normalizedUrl = normalizeUrl(url);
  
  // Ruta raíz es caso especial - solo activa si estamos en la raíz exacta
  if (normalizedUrl === '/' && normalizedCurrentPath === '/') {
    return true;
  }
  
  // Para rutas de idioma principal (e.g. /es/ o /en/) - solo activas si estamos exactamente en ellas
  if (normalizedUrl.match(/^\/[a-z]{2}\/?$/)) {
    return normalizedCurrentPath === normalizedUrl;
  }
  
  // Para otras rutas, solo considerar activa si hay una coincidencia exacta
  // o si es una subpágina directa (evitando que rutas padre se activen)
  const urlParts = normalizedUrl.split('/').filter(part => part);
  const currentParts = normalizedCurrentPath.split('/').filter(part => part);
  
  if (urlParts.length === currentParts.length) {
    // Coincidencia exacta
    return normalizedCurrentPath === normalizedUrl;
  } else if (currentParts.length > urlParts.length) {
    // Posiblemente un subelemento, pero solo comparamos exact path o siguiente nivel
    // Para evitar que "Inicio" (/es/) se marque cuando estamos en otra sección
    return urlParts.length > 1 && 
           currentParts.slice(0, urlParts.length).join('/') === urlParts.join('/');
  }
  
  return false;
}

// Función para mostrar el nombre completo del idioma
function getLanguageDisplayName(langCode) {
  // Si no hay código de idioma, usar español por defecto
  if (!langCode) return 'Español';
  
  // Map de idiomas conocidos para respaldo (independiente de la API)
  const languageMap = {
    'es': 'Español',
    'en': 'English',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'pt': 'Português'
  };
  
  try {
    // Buscar el idioma en los disponibles en la API
    const lang = availableLanguages.value?.find(l => (l.code || l) === langCode);
    
    // Si lo encontramos y tiene nombre, devolverlo
    if (lang && lang.display_name) {
      return lang.display_name;
    }
    
    // Si no lo encontramos en la API pero tenemos un mapeo conocido, usarlo
    if (languageMap[langCode]) {
      return languageMap[langCode];
    }
    
    // Último recurso: mostrar el código en mayúscula como nombre
    return langCode.toUpperCase();
  } catch (error) {
    // console.error('Error al obtener nombre de idioma:', error);
    // Si algo falla, usar el mapa estático o el código
    return languageMap[langCode] || langCode.toUpperCase();
  }
  // Ya se ha retornado en los bloques try-catch
}

const whatsappNumber = ref('5212345678901'); // ← cámbialo por el tuyo

// Función para contacto WhatsApp
function contactWhatsApp() {
  const url = `https://wa.me/${whatsappNumber.value}`;
  window.open(url, '_blank');
}

// Función para navegar al inicio
const navigateToHome = () => {
  router.push(homeUrl.value);
};

/**
 * Maneja errores de carga de imágenes
 */
const handleImageError = (event) => {
  // console.error('Error al cargar imagen del navbar:', event.target.src);
  // Marcar la imagen como no válida para usar el respaldo
  event.target.style.display = 'none';
};

// Encontrar la pestaña activa basada en la ruta actual
function findActiveTab() {
  if (!navItems.value || navItems.value.length === 0) return;
  
  const currentPath = route.path;
  
  // Buscar la coincidencia más cercana en el menú
  for (let i = 0; i < navItems.value.length; i++) {
    const item = navItems.value[i];
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
}

// Actualizar la pestaña activa basada en la ruta
function updateActiveTab(path) {
  if (!processedNavItems.value.length) return;
  
  // Primero buscar coincidencia exacta
  const exactMatch = processedNavItems.value.find(item => item.url === path);
  if (exactMatch) {
    activeTab.value = processedNavItems.value.indexOf(exactMatch);
    return;
  }
  
  // Si no hay coincidencia exacta, buscar en hijos
  for (let i = 0; i < processedNavItems.value.length; i++) {
    const item = processedNavItems.value[i];
    if (item.children && item.children.length) {
      const childMatch = item.children.find(child => child.url === path);
      if (childMatch) {
        activeTab.value = i; // Activar el padre
        return;
      }
    }
  }
  
  // Si aún no hay coincidencia, buscar coincidencia parcial
  for (let i = 0; i < processedNavItems.value.length; i++) {
    const item = processedNavItems.value[i];
    if (path.startsWith(item.url) && item.url !== '/') {
      activeTab.value = i;
      return;
    }
  }
  
  // Si no hay coincidencia, usar el primer elemento
  activeTab.value = 0;



}

</script>

<style scoped>

.transition-colors   { transition: background-color .2s ease, color .2s ease; }
.transition-transform{ transition: transform .3s ease; }
.hover-translatey-2px:hover{ transform: translateY(-2px); }
.hover-shadow-2:hover{/* sin sombra */}

.bg-white-1{ background: rgba(255,255,255,.10); }
.bg-white-2{ background: rgba(255,255,255,.15); }
.text-weight-600{ font-weight:600; }

.navbar-link{ position:relative; }              /* NUEVO */
.bg-white-2::after{
  content:''; position:absolute; bottom:2px; left:0;    /* ← arranca al inicio */
  width:100%; height:3px; border-radius:2px;
  background:var(--q-warning);
}

header{ min-height:96px; }                 /* alto total (fila acciones + menú) */
.action-bar{
  height: 44px;            /* un poco más alta para los size="md"        */
  padding: 0 0 6px;        /* espacio entre action-bar y barra principal */
}

/* evita salto de línea en TODOS los botones del menú */
.navbar-link,
.navbar-link .q-btn__content,
.navbar-link .q-btn-dropdown__label{
  white-space:nowrap !important;
}

.language-selector .q-icon,
.certiffy-contact-button .q-icon{
  font-size: 20px;
}
/* ancho mínimo para dropdowns largos (opcional; ajusta 130-150) */
.navbar-link.q-btn-dropdown{ min-width:140px; }

/* margen vertical negativo eliminado */
.btn-up{ margin-top:0 !important; }

@media (max-width:1024px){
  .gt-sm{ display:none; }                  /* oculta elementos desktop en móvil */
}
</style>

