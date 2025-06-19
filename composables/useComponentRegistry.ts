// Composable para manejar el registro dinámico de componentes
import { ref, computed } from 'vue';

// Definición de tipos para TypeScript
type ComponentType = string | object;
interface ComponentRegistry {
  set(key: string, value: ComponentType): void;
  get(key: string): ComponentType;
  has(key: string): boolean;
}

// Constantes para la nomenclatura de componentes
const COMPONENT_NAME_PREFIX = 'Api';
const COMPONENT_NAME_SUFFIX = 'Component';

export function useComponentRegistry() {
  // Registro de componentes disponibles
  const componentRegistry = ref<Map<string, ComponentType>>(new Map());
  
  // Fallback para tipos de bloques no registrados
  const fallbackComponent = ref<ComponentType>('div');
  
  // Registrar un componente
  const registerComponent = (blockType: string, component: ComponentType): boolean => {
    componentRegistry.value.set(blockType.toLowerCase(), component);
    return true;
  };
  
  // Registrar múltiples componentes a la vez
  const registerComponents = (componentMap: Record<string, ComponentType>): boolean => {
    for (const [blockType, component] of Object.entries(componentMap)) {
      registerComponent(blockType, component);
    }
    return true;
  };
  
  // Obtener un componente por su tipo
  const getComponentForType = (blockType?: string): ComponentType => {
    if (!blockType) return fallbackComponent.value;
    
    const normalizedType = blockType.toLowerCase();
    
    // Verificar si ya tenemos el componente registrado
    if (componentRegistry.value.has(normalizedType)) {
      return componentRegistry.value.get(normalizedType) || fallbackComponent.value;
    }
    
    // Si no está registrado, usar componente fallback
    return fallbackComponent.value;
  };
  
  // Verificar si existe un componente para el tipo
  const hasComponentForType = (blockType?: string): boolean => {
    if (!blockType) return false;
    
    const normalizedType = blockType.toLowerCase();
    return componentRegistry.value.has(normalizedType);
  };
  
  // Establecer el componente fallback
  const setFallbackComponent = (component: ComponentType): boolean => {
    fallbackComponent.value = component;
    return true;
  };
  
  return {
    registerComponent,
    registerComponents,
    getComponentForType,
    hasComponentForType,
    setFallbackComponent,
    componentRegistry
  };
}
