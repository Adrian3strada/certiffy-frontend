/**
 * Adaptadores para transformar datos de Wagtail a los formatos esperados por nuestros componentes base
 */
import { computed } from 'vue';

/**
 * Transforma un bloque de Wagtail en datos para ModuloBanner
 * @param {Object} block - Bloque de datos de Wagtail
 * @returns {Object} Datos formateados para ModuloBanner
 */
export function adaptToBanner(block) {
  // Valores por defecto si algunas propiedades están ausentes
  const defaults = {
    tamanioBanner: 'normal',
    imagenFondo: '',
    titulo: '',
    subtitulo: '',
    descripcion: '',
    usarOverlay: true,
    colorOverlay: 'rgba(0, 0, 0, 0.4)',
    posicionTexto: 'center'
  };

  // Si el bloque es de tipo 'banner'
  if (block?.type === 'banner') {
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      subtitulo: block.value.subtitle || defaults.subtitulo,
      descripcion: block.value.description || defaults.descripcion,
      imagenFondo: block.value.image?.url || defaults.imagenFondo,
      tamanioBanner: block.value.size || defaults.tamanioBanner,
      colorOverlay: block.value.overlay_color || defaults.colorOverlay,
      usarOverlay: block.value.use_overlay ?? defaults.usarOverlay
    };
  }

  // Si es un objeto genérico
  return {
    ...defaults,
    titulo: block?.title || block?.heading || defaults.titulo,
    subtitulo: block?.subtitle || defaults.subtitulo,
    descripcion: block?.description || block?.text || defaults.descripcion,
    imagenFondo: block?.image_url || block?.background_image || defaults.imagenFondo
  };
}

/**
 * Transforma un bloque de Wagtail en datos para ModuloMedia
 * @param {Object} block - Bloque de datos de Wagtail
 * @returns {Object} Datos formateados para ModuloMedia
 */
export function adaptToMedia(block) {
  // Valores por defecto si algunas propiedades están ausentes
  const defaults = {
    titulo: '',
    subtitulo: '',
    texto: '',
    mediaUrl: '',
    posicionMedia: 'right',
    distribucionColumnas: '6-6'
  };

  // Si el bloque es de tipo 'media_block'
  if (block?.type === 'media_block') {
    const position = block.value.media_position || 'right';
    
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      subtitulo: block.value.subtitle || defaults.subtitulo,
      texto: block.value.text || defaults.texto,
      mediaUrl: block.value.media?.url || defaults.mediaUrl,
      posicionMedia: position,
      distribucionColumnas: block.value.column_distribution || (position === 'left' ? '4-8' : '8-4')
    };
  }
  
  // Si el bloque es de tipo 'text_image'
  if (block?.type === 'text_image') {
    const position = block.value.image_position || 'right';
    
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      texto: block.value.text || defaults.texto,
      mediaUrl: block.value.image?.url || defaults.mediaUrl,
      posicionMedia: position,
      distribucionColumnas: position === 'left' ? '4-8' : '8-4'
    };
  }

  // Si es un objeto genérico
  return {
    ...defaults,
    titulo: block?.title || block?.heading || defaults.titulo,
    subtitulo: block?.subtitle || defaults.subtitulo,
    texto: block?.text || block?.content || defaults.texto,
    mediaUrl: block?.image_url || block?.media_url || defaults.mediaUrl,
    posicionMedia: block?.media_position || defaults.posicionMedia
  };
}

/**
 * Transforma un bloque de Wagtail en datos para ModuloGaleria
 * @param {Object} block - Bloque de datos de Wagtail
 * @returns {Object} Datos formateados para ModuloGaleria
 */
export function adaptToGallery(block) {
  // Valores por defecto si algunas propiedades están ausentes
  const defaults = {
    titulo: '',
    descripcion: '',
    tipoGaleria: 'imagenes',
    items: [],
    columnasDesktop: 3,
    columnasTablet: 2,
    columnasMobile: 1
  };

  // Si el bloque es de tipo 'gallery'
  if (block?.type === 'gallery') {
    const items = (block.value.items || []).map(item => ({
      imagenUrl: item.image?.url || '',
      titulo: item.title || '',
      descripcion: item.description || ''
    }));
    
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      descripcion: block.value.description || defaults.descripcion,
      items,
      columnasDesktop: block.value.columns_desktop || defaults.columnasDesktop
    };
  }
  
  // Si el bloque es de tipo 'document_gallery'
  if (block?.type === 'document_gallery') {
    const items = (block.value.documents || []).map(doc => ({
      titulo: doc.title || '',
      url: doc.file?.url || '',
      icono: 'description',
      accion: 'Ver documento'
    }));
    
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      descripcion: block.value.description || defaults.descripcion,
      tipoGaleria: 'documentos',
      items
    };
  }

  // Si es un objeto genérico con una colección de imágenes
  if (block?.images || block?.gallery_items) {
    const itemsArray = block?.images || block?.gallery_items || [];
    const items = itemsArray.map(item => ({
      imagenUrl: item.url || item.image_url || '',
      titulo: item.title || item.caption || '',
      descripcion: item.description || ''
    }));
    
    return {
      ...defaults,
      titulo: block?.title || block?.gallery_title || defaults.titulo,
      descripcion: block?.description || defaults.descripcion,
      items
    };
  }

  // Para otros casos, devolver los valores por defecto
  return defaults;
}

/**
 * Transforma un bloque de Wagtail en datos para ModuloInfoSeccion
 * @param {Object} block - Bloque de datos de Wagtail
 * @returns {Object} Datos formateados para ModuloInfoSeccion
 */
export function adaptToInfoSection(block) {
  // Valores por defecto si algunas propiedades están ausentes
  const defaults = {
    titulo: '',
    descripcion: '',
    imagenFondo: '',
    posicionTexto: 'izquierda',
    alineacionTexto: 'izquierda',
    colorTexto: 'white'
  };

  // Si el bloque es de tipo 'info_section'
  if (block?.type === 'info_section') {
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      descripcion: block.value.description || defaults.texto,
      imagenFondo: block.value.background_image?.url || defaults.imagenFondo,
      posicionTexto: block.value.text_position || defaults.posicionTexto,
      alineacionTexto: block.value.text_alignment || defaults.alineacionTexto
    };
  }

  // Si es un objeto genérico
  return {
    ...defaults,
    titulo: block?.title || block?.heading || defaults.titulo,
    descripcion: block?.description || block?.text || defaults.descripcion,
    imagenFondo: block?.background_image || block?.image_url || defaults.imagenFondo,
    posicionTexto: block?.text_position || defaults.posicionTexto,
    alineacionTexto: block?.text_alignment || defaults.alineacionTexto
  };
}

/**
 * Transforma un bloque de Wagtail en datos para ModuloTarjeta
 * @param {Object} block - Bloque de datos de Wagtail
 * @returns {Object} Datos formateados para ModuloTarjeta
 */
export function adaptToCard(block) {
  // Valores por defecto si algunas propiedades están ausentes
  const defaults = {
    titulo: '',
    subtitulo: '',
    contenido: '',
    imagenUrl: '',
    accionPrimaria: '',
    rutaAccionPrimaria: '#',
    efectoHover: true
  };

  // Si el bloque es de tipo 'card'
  if (block?.type === 'card') {
    return {
      ...defaults,
      titulo: block.value.title || defaults.titulo,
      subtitulo: block.value.subtitle || defaults.subtitulo,
      contenido: block.value.content || defaults.contenido,
      imagenUrl: block.value.image?.url || defaults.imagenUrl,
      accionPrimaria: block.value.button_text || defaults.accionPrimaria,
      rutaAccionPrimaria: block.value.button_url || defaults.rutaAccionPrimaria,
      efectoHover: block.value.hover_effect ?? defaults.efectoHover
    };
  }

  // Si es un objeto genérico
  return {
    ...defaults,
    titulo: block?.title || defaults.titulo,
    subtitulo: block?.subtitle || defaults.subtitulo,
    contenido: block?.content || block?.text || defaults.contenido,
    imagenUrl: block?.image_url || defaults.imagenUrl,
    accionPrimaria: block?.button_text || defaults.accionPrimaria,
    rutaAccionPrimaria: block?.button_url || defaults.rutaAccionPrimaria
  };
}

/**
 * Hook para adaptar bloques de Wagtail a componentes
 */
export function useComponentAdapter() {
  return {
    adaptToBanner,
    adaptToMedia,
    adaptToGallery,
    adaptToInfoSection,
    adaptToCard
  };
}

export default useComponentAdapter;
