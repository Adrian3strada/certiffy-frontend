<template>
  <header class="navbar bg-dark text-white q-py-sm shadow-2">
    <div class="q-px-lg q-mx-auto" style="max-width: 1200px; width: 100%">
      <div class="row full-width items-center">
          <!-- Logo -->
          <div class="col-auto">
            <q-img
              :src="logoUrl"
              alt="Logo CERTIFFY"
              spinner-color="primary"
              width="80px"
              class="q-mr-md"
            />
          </div>
          
          <q-space />
          
          <!-- Menú de navegación para pantallas medianas y grandes -->
          <div class="col-auto gt-sm">
            <q-tabs
              v-model="activeTab"
              inline-label
              class="text-white"
              indicator-color="accent"
              align="right"
            >
              <q-route-tab 
                v-for="(item, index) in navItems" 
                :key="index"
                :to="item.url"
                :label="item.label"
                no-caps
                class="text-weight-medium q-px-md"
              />
            </q-tabs>
          </div>
          
          <!-- Botón de menú para móviles -->
          <div class="col-auto lt-md">
            <q-btn
              flat
              round
              color="white"
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
      :width="250"
      :breakpoint="1024"
      class="bg-dark text-white"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-accent q-mt-md">CERTIFFY</q-item-label>
          
          <q-separator spaced dark />
          
          <q-item 
            v-for="(item, index) in navItems" 
            :key="index"
            :to="item.url" 
            clickable 
            v-close-popup
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

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

// Establecer la pestaña activa basada en la ruta actual
const route = useRoute();

// Establecer tab activa inicialmente
if (route && route.path) {
  activeTab.value = route.path;
} else {
  // Valor por defecto si no hay ruta disponible
  activeTab.value = props.navItems[0]?.url || '/';
}
</script>

