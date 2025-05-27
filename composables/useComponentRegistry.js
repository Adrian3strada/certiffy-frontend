// Composable para manejar el registro dinámico de componentes
import { ref, computed } from 'vue';

// Tipos de bloques conocidos y sus nombres de componentes asociados
const componentNamePrefix = 'Api';
const componentNameSuffix = 'Component';

export function useComponentRegistry() {
  // Registro de componentes disponibles
  const componentRegistry = ref(new Map());
  
  // Fallback para tipos de bloques no registrados
  const fallbackComponent = ref('div');
  
  // Registrar un componente
  const registerComponent = (blockType, component) => {
    componentRegistry.value.set(blockType.toLowerCase(), component);
    return true;
  };
  
  // Registrar múltiples componentes a la vez
  const registerComponents = (componentMap) => {
    for (const [blockType, component] of Object.entries(componentMap)) {
      registerComponent(blockType, component);
    }
    return true;
  };
  
  // Obtener un componente por su tipo
  const getComponentForType = (blockType) => {
    if (!blockType) return fallbackComponent.value;
    
    const normalizedType = blockType.toLowerCase();
    
    // Verificar si ya tenemos el componente registrado
    if (componentRegistry.value.has(normalizedType)) {
      return componentRegistry.value.get(normalizedType);
    }
    
    // Si no está registrado, intentar usar convención de nombres
    try {
      // Intentar cargar el componente basado en el tipo de bloque
      // Convertir snake_case o kebab-case a PascalCase
      const pascalCaseType = normalizedType
        .replace(/([-_][a-z])/g, group => group
          .replace('-', '')
          .replace('_', '')
          .toUpperCase());
      
      const componentName = componentNamePrefix + 
        pascalCaseType.charAt(0).toUpperCase() + 
        pascalCaseType.slice(1) + 
        componentNameSuffix;
      
      // Intentar importar dinámicamente el componente
      // Esto funciona para referencias estáticas conocidas en tiempo de compilación
      console.log(`Intentando cargar componente: ${componentName} para tipo: ${blockType}`);
      
      // Si no tenemos el componente, devolver un div como fallback
      return fallbackComponent.value;
    } catch (error) {
      console.warn(`No se pudo cargar un componente para el tipo: ${blockType}`, error);
      return fallbackComponent.value;
    }
  };
  
  // Verificar si existe un componente para el tipo
  const hasComponentForType = (blockType) => {
    if (!blockType) return false;
    
    const normalizedType = blockType.toLowerCase();
    return componentRegistry.value.has(normalizedType);
  };
  
  // Establecer el componente fallback
  const setFallbackComponent = (component) => {
    fallbackComponent.value = component;
    return true;
  };
  
  // Auto-registro de componentes conocidos
  const initRegistry = async () => {
    try {
      // En un entorno de producción real, podrías hacer algo como:
      // const moduleContext = import.meta.glob('../components/api/*.vue')
      // Y luego cargar todos los componentes dinámicamente
      
      // Por ahora, inicializamos con un mapa vacío
      // Los componentes se registrarán cuando se utilicen
      console.log('Inicializando registro de componentes');
    } catch (error) {
      console.error('Error al inicializar el registro de componentes:', error);
    }
  };
  
  // Inicializar el registro
  if (typeof window !== 'undefined') {
    // Solo inicializar en el navegador, no en SSR
    setTimeout(() => {
      initRegistry();
    }, 200);
  }
  
  return {
    registerComponent,
    registerComponents,
    getComponentForType,
    hasComponentForType,
    setFallbackComponent,
    componentRegistry
  };
}
