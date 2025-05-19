<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleDrawer"
      />

      <q-toolbar-title>
        CMS Marketing
      </q-toolbar-title>

      <div>
        <q-btn-dropdown flat label="Usuario" icon="mdi-account">
          <q-list>
            <q-item clickable v-close-popup @click="goToProfile">
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const emit = defineEmits(['toggle-drawer']);
const router = useRouter();

const toggleDrawer = () => {
  emit('toggle-drawer');
};

const goToProfile = () => {
  router.push('/admin/profile');
};

const logout = () => {
  // Aquí iría la lógica para cerrar sesión
  router.push('/admin/login');
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
