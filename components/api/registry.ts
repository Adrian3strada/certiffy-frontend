// Registro centralizado de componentes para renderizado dinámico
// Este archivo mapea todos los tipos de bloques de la API de Wagtail a sus componentes Vue correspondientes
// IMPORTANTE: Cualquier nuevo tipo de bloque debe registrarse aquí para ser renderizado correctamente

// Importar componentes básicos (bloques)
import ApiButtonComponent from './blocks/ApiButtonComponent.vue';
import ApiDocumentComponent from './blocks/ApiDocumentComponent.vue';
import ApiDocumentsContainerComponent from './blocks/ApiDocumentsContainerComponent.vue';
import ApiGalleryComponent from './blocks/ApiGalleryComponent.vue';
import ApiHeroBannerComponent from './blocks/ApiHeroBannerComponent.vue';
import ApiImageComponent from './blocks/ApiImageComponent.vue';
import ApiModulosVideoComponent from './blocks/ApiModulosVideoComponent.vue';
import ApiRichTextComponent from './blocks/ApiRichTextComponent.vue';

// Importar componentes especializados (feature-blocks)
import ApiCardComponent from './feature-blocks/ApiCardComponent.vue';
import ApiCardsEDComponent from './feature-blocks/ApiCardsEDComponent.vue';
import ApiCarouselComponent from './feature-blocks/ApiCarouselComponent.vue';
import ApiGrupoTarjetasFondo from './feature-blocks/ApiGrupoTarjetasFondo.vue';
import ApiImagenTexto from './feature-blocks/ApiImagenTexto.vue';
import ApiMisionComponent from './feature-blocks/ApiMisionComponent.vue';
import ApiPactoVerdeComponent from './feature-blocks/ApiPactoVerdeComponent.vue';
import ApiSociosComponent from './feature-blocks/ApiSociosComponent.vue';
import ApiTestimonialsComponent from './feature-blocks/ApiTestimonialsComponent.vue';
import ApiVideoComponent from './feature-blocks/ApiVideoComponent.vue';

// Componentes de layout (no utilizados directamente en renderizado dinámico)
import ApiFooterComponent from './layout/ApiFooterComponent.vue';
import ApiNavbarComponent from './layout/ApiNavbarComponent.vue';

// Definir el tipo para el mapa de componentes
import type { Component } from 'vue';

interface ComponentMap {
  [key: string]: Component;
}

// Mapa centralizado de todos los componentes con todas las posibles variantes de nombres
// IMPORTANTE: Para cada tipo de bloque de la API, debe existir una entrada en este mapa
export const componentMap: ComponentMap = {
  // Bloques básicos - nombres estandarizados
  'button': ApiButtonComponent,
  'document': ApiDocumentComponent,
  'documents_container': ApiDocumentsContainerComponent,
  'documents': ApiDocumentsContainerComponent,
  'gallery': ApiGalleryComponent,
  'hero_banner': ApiHeroBannerComponent,
  'image': ApiImageComponent,
  'modulo_video': ApiModulosVideoComponent,
  'modulo_certiffy': ApiModulosVideoComponent, // Nuevo tipo de bloque
  'modulos_certiffy': ApiModulosVideoComponent, // Variante en plural del tipo de bloque
  'rich_text': ApiRichTextComponent,
  
  // Bloques especializados - nombres estandarizados
  'card': ApiCardComponent,
  'cards': ApiCardComponent,
  'grupo_de_noticias': ApiCardComponent,
  'cardsED': ApiCardsEDComponent,
  'carousel': ApiCarouselComponent,
  'mision': ApiMisionComponent,
  'pacto_verde': ApiPactoVerdeComponent,
  'socios': ApiSociosComponent,
  'testimonios': ApiTestimonialsComponent,
  'video': ApiVideoComponent,
  
  // Mapeos específicos de Wagtail (nombres originales del CMS)
  'paragraph': ApiRichTextComponent,
  'heading': ApiRichTextComponent,
  'image_text': ApiHeroBannerComponent,
  'ImagenTexto': ApiImagenTexto,
  'imagentexto': ApiImagenTexto,
  'documento': ApiDocumentComponent,
  'Document': ApiDocumentComponent,
  'galeria': ApiGalleryComponent,
  
  // Mapeos alternativos (para manejar inconsistencias en la API)
  'text': ApiRichTextComponent,
  'texto': ApiRichTextComponent,
  'texto_enriquecido': ApiRichTextComponent,
  'parrafo_con_alineacion': ApiRichTextComponent,
  'banner': ApiHeroBannerComponent,
  'banner_hero': ApiHeroBannerComponent,
  'imagen': ApiImageComponent,
  'imagen_texto': ApiHeroBannerComponent,
  'boton': ApiButtonComponent,
  'video_modulo': ApiModulosVideoComponent,
  'modulo_certificacion': ApiModulosVideoComponent,
  'modulos_video': ApiModulosVideoComponent,
};

/**
 * Registra todos los componentes en el registro proporcionado
 * @param registerFn - Función para registrar cada componente (tipo, componente)
 */
export function registerAllComponents(registerFn: (type: string, component: Component) => void): void {
  if (!registerFn || typeof registerFn !== 'function') {
    return;
  }
  
  Object.entries(componentMap).forEach(([type, component]) => {
    registerFn(type, component);
    // Registrar también en minúsculas para mayor compatibilidad
    if (type !== type.toLowerCase()) {
      registerFn(type.toLowerCase(), component);
    }
  });
}

/**
 * Obtiene un componente por su tipo
 * @param type - Tipo de bloque 
 * @returns Componente Vue o null si no existe
 */
export function getComponentByType(type: string): Component | null {
  if (!type) return null;
  
  // Normalizar tipo a minúsculas para búsqueda uniforme
  const normalizedType = type.toLowerCase();
  
  // Buscar coincidencia exacta
  if (componentMap[normalizedType]) {
    return componentMap[normalizedType];
  }
  
  // Buscar coincidencia por clave
  const key = Object.keys(componentMap).find(
    k => k.toLowerCase() === normalizedType
  );
  
  return key ? componentMap[key] : null;
}

/**
 * Verifica si existe un componente para un tipo específico
 * @param type - Tipo de bloque
 * @returns True si existe, false en caso contrario
 */
export function hasComponentForType(type: string): boolean {
  if (!type) return false;
  
  // Normalizar tipo a minúsculas
  const normalizedType = type.toLowerCase();
  
  // Verificar coincidencia exacta
  if (componentMap[normalizedType]) {
    return true;
  }
  
  // Verificar coincidencia por clave
  return Object.keys(componentMap).some(
    k => k.toLowerCase() === normalizedType
  );
}
