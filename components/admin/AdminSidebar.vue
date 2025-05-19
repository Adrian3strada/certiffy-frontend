<template>
  <q-drawer
    v-model="drawer"
    :width="250"
    bordered
    class="bg-grey-2"
    :breakpoint="500"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item-label header>Panel de Administración</q-item-label>
        
        <q-item clickable v-ripple to="/admin">
          <q-item-section avatar>
            <q-icon name="mdi-view-dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        
        <q-item clickable v-ripple to="/admin/pages">
          <q-item-section avatar>
            <q-icon name="mdi-file-document" />
          </q-item-section>
          <q-item-section>Páginas</q-item-section>
        </q-item>
        
        <q-item clickable v-ripple to="/admin/templates">
          <q-item-section avatar>
            <q-icon name="mdi-file-table" />
          </q-item-section>
          <q-item-section>Plantillas</q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item-label header>Herramientas</q-item-label>
        
        <q-item clickable v-ripple to="/admin/external-api">
          <q-item-section avatar>
            <q-icon name="mdi-api" />
          </q-item-section>
          <q-item-section>API Externa</q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item-label header>Configuración</q-item-label>
        
        <q-item clickable v-ripple to="/admin/settings">
          <q-item-section avatar>
            <q-icon name="mdi-cog" />
          </q-item-section>
          <q-item-section>Ajustes</q-item-section>
        </q-item>
        
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="mdi-logout" />
          </q-item-section>
          <q-item-section>Cerrar Sesión</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const router = useRouter();

const drawer = ref(props.modelValue);

// Observar cambios en el drawer para emitir eventos
watch(drawer, (val) => {
  emit('update:modelValue', val);
});

// Observar cambios en props para actualizar el drawer
watch(() => props.modelValue, (val) => {
  drawer.value = val;
});

// Función para cerrar sesión
const logout = () => {
  // Aquí iría la lógica para cerrar sesión
  // Por ahora solo redirigimos a la página de login
  router.push('/admin/login');
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
