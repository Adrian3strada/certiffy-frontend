<template>
  <header class="navbar-component bg-dark text-white q-py-sm shadow-2">
    <div class="q-px-md q-px-sm-lg q-mx-auto" style="max-width: 1200px; width: 100%">
      <div class="row full-width items-center">
          <!-- Logo -->
          <div class="col-auto">
            <q-img
              :src="logoUrl"
              alt="Logo CERTIFFY"
              spinner-color="primary"
              :width="logoWidth"
              class="q-mr-md logo-image"
            />
          </div>
          
          <q-space />
          
          <!-- Menú de navegación para pantallas medianas y grandes -->
          <div class="col-auto gt-sm nav-tabs-container">
            <q-tabs
              v-model="activeTab"
              inline-label
              class="text-white nav-tabs"
              indicator-color="accent"
              align="right"
              :dense="$q.screen.lt.md"
            >
              <q-route-tab 
                v-for="(item, index) in navItems" 
                :key="index"
                :to="item.url"
                :label="item.label"
                no-caps
                class="nav-tab text-weight-medium q-px-md"
              />
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
          
          <q-item 
            v-for="(item, index) in navItems" 
            :key="index"
            :to="item.url" 
            clickable 
            v-close-popup
            class="drawer-item"
          >
            <q-item-section>
              <q-item-label class="drawer-item-label">{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();

const props = defineProps({
  logoUrl: {
    type: String,
    required: true
  },
  navItems: {
    type: Array,
    required: true
  }
});

// Variables reactivas para el estado del componente
const activeTab = ref(null);
const drawerOpen = ref(false);
const windowWidth = ref(window.innerWidth);

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // Establecer la pestaña activa basada en la ruta actual
  const currentPath = route.path;
  const activeIndex = props.navItems.findIndex(item => item.url === currentPath);
  if (activeIndex !== -1) {
    activeTab.value = props.navItems[activeIndex].url;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Ancho del logo responsivo
const logoWidth = computed(() => {
  if (windowWidth.value < 600) {
    return '70px';
  } else {
    return '80px';
  }
});

// Ancho del drawer responsivo
const drawerWidth = computed(() => {
  if (windowWidth.value < 400) {
    return 200;
  } else {
    return 250;
  }
});

// Establecer tab activa inicialmente
if (route && route.path) {
  activeTab.value = route.path;
} else {
  // Valor por defecto si no hay ruta disponible
  activeTab.value = props.navItems[0]?.url || '/';
}
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

.navbar-component .nav-tab {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.navbar-component .nav-tab:hover {
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

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .navbar-component {
    padding: 4px 0 !important;
  }
  
  .navbar-component .drawer-header {
    font-size: 1rem !important;
  }
  
  .navbar-component .drawer-item-label {
    font-size: 0.9rem !important;
  }
  
  .navbar-component .drawer-item {
    min-height: 40px !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .navbar-component .nav-tab {
    font-size: 0.9rem !important;
    padding: 0 12px !important;
  }
}
</style>
