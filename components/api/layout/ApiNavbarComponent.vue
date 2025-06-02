<template>
  <header class="navbar-component bg-dark text-white q-py-sm shadow-2">
    <div class="q-px-md q-px-sm-lg q-mx-auto" style="max-width: 1200px; width: 100%">
      <div class="row full-width items-center">
        <!-- Logo (solo se muestra si viene de la API) -->
        <!-- Oculto para mantener consistencia con enfoque headless -->
        
        <q-space />
        
        <!-- Menú de navegación para pantallas medianas y grandes con submenús -->
        <div class="col-auto gt-sm nav-tabs-container">
          <q-tabs
            v-model="activeTab"
            inline-label
            class="text-white nav-tabs"
            indicator-color="accent"
            align="right"
            :dense="$q.screen.lt.md"
          >
            <template v-for="(item, index) in navItems" :key="index">
              <!-- Elemento de menú con submenú -->
              <q-btn-dropdown
                v-if="item.children && item.children.length > 0"
                :label="item.title"
                flat
                no-caps
                dropdown-icon="expand_more"
                class="nav-dropdown text-white q-px-md text-weight-medium"
                auto-close
                :ripple="false"
              >
                <q-list class="bg-dark">
                  <nuxt-link 
                    v-for="(child, childIndex) in item.children" 
                    :key="childIndex" 
                    :to="normalizeUrl(child.url)"
                    class="text-decoration-none"
                  >
                    <q-item clickable class="text-white dropdown-item">
                      <q-item-section>{{ child.title }}</q-item-section>
                    </q-item>
                  </nuxt-link>
                </q-list>
              </q-btn-dropdown>
              
              <!-- Elemento de menú simple -->
              <q-route-tab
                v-else
                :to="normalizeUrl(item.url)"
                :label="item.title"
                no-caps
                class="nav-tab text-weight-medium q-px-md"
              />
            </template>
          </q-tabs>
        </div>
        
        <!-- Botón de menú para móviles -->
        <div class="col-auto lt-md menu-button-container">
          <q-btn
            flat
            round
            color="white"
            icon="menu"
            @click="drawerOpen = !drawerOpen"
            class="menu-button"
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
      class="bg-dark text-white mobile-drawer"
    >
      <q-scroll-area class="fit">
        <q-list padding class="drawer-list">
          <q-item-label header class="drawer-header text-accent q-mt-md">CERTIFFY</q-item-label>
          
          <q-separator spaced dark />
          
          <!-- Elemento con submenú -->
          <template v-for="(item, index) in navItems" :key="index">
            <!-- Si tiene submenús -->
            <template v-if="item.children && item.children.length > 0">
              <q-expansion-item
                :label="item.title"
                :header-class="'text-white drawer-parent-item'"
                expand-separator
                icon="expand_more"
                dark
              >
                <q-list class="q-pl-md">
                  <q-item
                    v-for="(child, childIndex) in item.children"
                    :key="childIndex"
                    :to="normalizeUrl(child.url)"
                    clickable
                    v-close-popup
                    class="drawer-item"
                  >
                    <q-item-section>
                      <q-item-label class="drawer-item-label">{{ child.title }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </template>
            
            <!-- Si no tiene submenús -->
            <q-item
              v-else
              :to="normalizeUrl(item.url)"
              clickable
              v-close-popup
              class="drawer-item"
            >
              <q-item-section>
                <q-item-label class="drawer-item-label">{{ item.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useWagtailApi, API_BASE_URL } from '~/composables/useWagtailApi';

const $q = useQuasar();
const route = useRoute();
const { getDataFromUrl, loading, error } = useWagtailApi();

const props = defineProps({
  navbarEndpoint: {
    type: String,
    default: `${API_BASE_URL}/api/v2/pages/`
  }
});

// Variables reactivas para el estado del componente
const navItems = ref([]);
const activeTab = ref(null);
const drawerOpen = ref(false);
const windowWidth = ref(window.innerWidth);
const fetchError = ref(null);
const isFetching = ref(false);

// Función para obtener los elementos de navegación de la API
const fetchNavItems = async () => {
  isFetching.value = true;
  fetchError.value = null;
  
  try {
    // Utilizamos el proxy para evitar problemas de CORS
    const proxyUrl = `/api/proxy-wagtail?url=${encodeURIComponent(props.navbarEndpoint)}`;
    const data = await getDataFromUrl(proxyUrl);
    
    if (data && data.navbar) {
      navItems.value = data.navbar;
    } else {
      fetchError.value = 'No se encontraron elementos de navegación en la API';
      console.error('Error obteniendo elementos de navegación:', fetchError.value);
    }
  } catch (err) {
    fetchError.value = err.message || 'Error al obtener elementos de navegación';
    console.error('Error obteniendo elementos de navegación:', err);
  } finally {
    isFetching.value = false;
  }
};

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // Obtener los elementos de navegación al montar el componente
  fetchNavItems();
  
  // Establecer la pestaña activa basada en la ruta actual
  const currentPath = route.path;
  updateActiveTab(currentPath);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Actualizar la pestaña activa basada en la ruta
const updateActiveTab = (path) => {
  if (!navItems.value.length) return;
  
  // Primero buscar coincidencia exacta
  const exactMatch = navItems.value.find(item => item.url === path);
  if (exactMatch) {
    activeTab.value = exactMatch.url;
    return;
  }
  
  // Si no hay coincidencia exacta, buscar en hijos
  for (const item of navItems.value) {
    if (item.children && item.children.length) {
      const childMatch = item.children.find(child => child.url === path);
      if (childMatch) {
        activeTab.value = item.url; // Activar el padre
        return;
      }
    }
  }
  
  // Si aún no hay coincidencia, buscar coincidencia parcial (ruta actual comienza con la URL del ítem)
  const partialMatch = navItems.value.find(item => path.startsWith(item.url) && item.url !== '/');
  if (partialMatch) {
    activeTab.value = partialMatch.url;
    return;
  }
  
  // Si no hay coincidencia, usar el primer elemento
  activeTab.value = navItems.value[0]?.url || '/';
};

// Ancho del drawer responsivo
const drawerWidth = computed(() => {
  if (windowWidth.value < 400) {
    return 200;
  } else {
    return 250;
  }
});

// Función para normalizar las URLs que vienen de la API
const normalizeUrl = (url) => {
  if (!url) return '/';
  
  // Eliminar trailing slash si existe (excepto para la página principal)
  if (url !== '/' && url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Asegurarse que las URLs relativas empiecen con /
  if (!url.startsWith('/') && !url.startsWith('http')) {
    url = '/' + url;
  }
  
  return url;
};
</script>

<style scoped>
.navbar-component {
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-component .logo-image {
  transition: width 0.3s ease;
}

.navbar-component .nav-tabs {
  transition: all 0.3s ease;
}

.navbar-component .nav-tab, 
.navbar-component .nav-dropdown {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.navbar-component .nav-tab:hover,
.navbar-component .nav-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-component .menu-button {
  transition: transform 0.2s ease;
}

.navbar-component .menu-button:hover {
  transform: scale(1.1);
}

.navbar-component .mobile-drawer .drawer-item {
  transition: background-color 0.2s ease;
}

.navbar-component .mobile-drawer .drawer-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-item {
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.text-decoration-none {
  text-decoration: none;
}

.logo-link {
  display: block;
  text-decoration: none;
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .navbar-component {
    padding: 4px 0 !important;
  }
}
</style>
