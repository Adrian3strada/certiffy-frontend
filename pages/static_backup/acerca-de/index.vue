<template>
  <q-page class="q-pa-md">
    <!-- Título de la sección dinámico que puede ser cambiado desde el CMS -->
    <div v-if="paginaTitulo" class="text-h3 text-weight-bold text-center q-my-lg">{{ paginaTitulo }}</div>
   
    <!-- Contenedor para los componentes con espaciado adecuado -->
    <div class="q-gutter-y-lg">
      <!-- Componentes dinámicos desde la API/mock data -->
      <template v-if="datosAcercaDe && secciones.length > 0">
        <InfoSectionComponent
          v-for="(seccion, idx) in secciones"
          :key="idx"
          :titulo="seccion.titulo"
          :descripcion="seccion.descripcion"
          :imagenFondo="seccion.imagenFondo"
          :posicionTexto="seccion.posicionTexto"
          :alineacionTexto="seccion.alineacionTexto"
          :colorOverlay="seccion.colorOverlay"
          :colorFondoError="seccion.colorFondoError"
          :colorTitulo="seccion.colorTitulo"
          :colorDescripcion="seccion.colorDescripcion"
          :alturaImagen="seccion.alturaImagen"
          :efectoHover="seccion.efectoHover"
          :borde="seccion.borde"
          :sombra="seccion.sombra"
        />
      </template>
     
      <!-- Estado de carga mientras se obtienen los datos -->
      <div v-else-if="cargando" class="flex flex-center column q-pa-xl">
        <q-spinner-dots color="primary" size="4rem" />
        <div class="text-body1 q-mt-md">Cargando información...</div>
      </div>
     
      <!-- Mensaje si no hay datos disponibles -->
      <div v-else class="flex flex-center column q-pa-xl">
        <q-icon name="info" color="grey" size="4rem" />
        <div class="text-body1 q-mt-md text-grey">No hay información disponible en este momento.</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { mockData } from '~/data/mockData';
import InfoSectionComponent from '~/components/certiffy/acerca-de/InfoSectionComponent.vue';

// Datos para los componentes - inicializado directamente con datos de respaldo
const datosAcercaDe = ref([...mockData.acercaDe]);
const paginaTitulo = ref('Acerca de Nosotros');
const cargando = ref(false);

// Procesar los datos para crear un array de secciones con todas las propiedades necesarias
const secciones = computed(() => {
  // Verificar si datosAcercaDe.value existe y es válido
  if (!datosAcercaDe.value || !Array.isArray(datosAcercaDe.value)) return [];
  
  // Transformar cada sección en un objeto con todas las propiedades necesarias para el componente
  const transformarSeccion = (seccion, index) => {
    return {
      titulo: seccion.titulo,
      descripcion: seccion.descripcion,
      imagenFondo: seccion.imagenFondo,
      posicionTexto: seccion.posicionTexto || (index % 2 === 0 ? 'izquierda' : 'derecha'),
      alineacionTexto: seccion.alineacionTexto || 'izquierda',
      colorOverlay: seccion.colorOverlay || 'rgba(0, 0, 0, 0.6)',
      colorFondoError: seccion.colorFondoError || '#f5f5f5',
      colorTitulo: seccion.colorTitulo || 'white',
      colorDescripcion: seccion.colorDescripcion || 'white',
      alturaImagen: seccion.alturaImagen || seccion.altura || '250px', // Usar 'altura' del mock si existe
      efectoHover: seccion.efectoHover !== undefined ? seccion.efectoHover : true,
      borde: seccion.borde !== undefined ? seccion.borde : true,
      sombra: seccion.sombra !== undefined ? seccion.sombra : true,
      // Propiedades adicionales del mock data
      colorSeparador: seccion.colorSeparador,
      anchoTexto: seccion.anchoTexto
    };
  };

  // Procesar todas las secciones del array
  return datosAcercaDe.value
    .filter(seccion => seccion.titulo && seccion.descripcion) // Filtrar secciones válidas
    .map((seccion, index) => transformarSeccion(seccion, index)); // Transformar cada sección
});

// Título de la página para SEO
useHead({
  title: `${paginaTitulo.value} - Certiffy`,
  meta: [
    { name: 'description', content: 'Conoce nuestra misión, visión y valores en Certiffy' }
  ]
});
</script>