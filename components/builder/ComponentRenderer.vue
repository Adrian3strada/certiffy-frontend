<template>
  <div class="component-renderer">
    <!-- Renderizar el componente según su tipo -->
    <component 
      :is="componentToRender" 
      v-if="componentToRender" 
      :content="content"
      :is-preview="isPreview"
    />
    <div v-else class="component-placeholder">
      <q-icon name="mdi-alert" color="warning" size="sm" />
      <span>Componente no encontrado: {{ type }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getComponentByType } from './ComponentRegistry';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  content: {
    type: Object,
    default: () => ({})
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Determinar qué componente renderizar según el tipo usando el registro de componentes
const componentToRender = computed(() => {
  // Obtener el componente del registro
  const component = getComponentByType(props.type);
  console.log(`Renderizando componente de tipo: ${props.type}`, component ? 'encontrado' : 'no encontrado');
  return component;
});
</script>

<style scoped>
.component-renderer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.component-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  color: #666;
  font-size: 14px;
  gap: 8px;
}
</style>
