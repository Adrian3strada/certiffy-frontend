import { defineAsyncComponent } from 'vue';
import type { Component } from 'vue';

// Importar componentes de bloques Wagtail
import EventFilterBlock from './EventFilterBlock.vue';

// Importar componentes de API para bloques Wagtail
const ApiCarouselComponent = defineAsyncComponent(() => import('../api/feature-blocks/ApiCarouselComponent.vue'));
const ApiTestimonialsComponent = defineAsyncComponent(() => import('../api/feature-blocks/ApiTestimonialsComponent.vue'));
const ApiModulosVideoComponent = defineAsyncComponent(() => import('../api/blocks/ApiModulosVideoComponent.vue'));
const ApiPactoVerdeComponent = defineAsyncComponent(() => import('../api/feature-blocks/ApiPactoVerdeComponent.vue'));
const ApiCardsEDComponent = defineAsyncComponent(() => import('../api/feature-blocks/ApiCardsEDComponent.vue'));
const ApiSociosComponent = defineAsyncComponent(() => import('../api/feature-blocks/ApiSociosComponent.vue'));
const ApiGrupoNoticiasComponent = defineAsyncComponent(() => import('../api/feature-blocks/ApiGrupoNoticiasComponent.vue'));

// Definir tipo para el registro de componentes
type BlockComponentRegistry = Record<string, Component>;

// Registro de componentes por tipo de bloque
const blockComponents: BlockComponentRegistry = {
  // Componente de filtrado de eventos
  'event_filter': EventFilterBlock,
  
  // Componentes para bloques de página principal
  'carousel': ApiCarouselComponent,
  'grupo_de_noticias': ApiGrupoNoticiasComponent,
  'testimonios': ApiTestimonialsComponent,
  'modulos_certiffy': ApiModulosVideoComponent,
  'pacto_verde': ApiPactoVerdeComponent,
  'cardsed': ApiCardsEDComponent,
  'socios': ApiSociosComponent
};

// Función para registrar todos los componentes en un registro
export function registerWagtailComponents(registerFunction: (type: string, component: Component) => void): void {
  // Registrar cada componente con su tipo normalizado
  Object.entries(blockComponents).forEach(([type, component]) => {
    // Normalizar el tipo a minúsculas
    const normalizedType = type.toLowerCase();
    console.log(`[WagtailRegistry] Registrando componente para tipo: ${normalizedType}`);
    registerFunction(normalizedType, component);
  });
}

// Función para verificar si un tipo está registrado
export function hasWagtailComponent(type: string): boolean {
  const normalizedType = type.toLowerCase();
  return normalizedType in blockComponents;
}

// Función para obtener un componente por su tipo
export function getWagtailComponent(type: string): Component | null {
  const normalizedType = type.toLowerCase();
  return blockComponents[normalizedType as keyof typeof blockComponents] || null;
}
