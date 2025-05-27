<template>
  <q-page class="certiffy-pagina">
    <div class="certiffy-contenedor">
      <!-- Banner principal (Imagen 1) -->
      <ModuloBanner
        :tamanio-banner="'normal'"
        :imagen-fondo="dueDiligenceData.banner.imagenUrl"
        :usar-overlay="true"
        :titulo="dueDiligenceData.banner.titulo"
        :titulo-clase="'text-h1 text-weight-bold text-white'"
        :color-overlay="'rgba(0, 0, 0, 0.4)'"
        :posicion-texto="'center'"
      />

      <!-- Módulo Titular con Texto y Foto (Imagen 2) -->
      <div class="q-mt-xl q-mb-xl">
        <ModuloMedia
          :titulo="dueDiligenceData.titular.subtitulo"
          :texto="dueDiligenceData.titular.descripcion"
          :media-url="dueDiligenceData.titular.imagenUrl"
          :titulo-media="dueDiligenceData.titular.imagenTitulo"
          :posicion-media="'right'"
          :distribucion-columnas="'7-5'"
          :titulo-clase="'text-h5 text-bold'"
          :media-ratio="4/3"
          :borde="true"
          :espaciado="'normal'"
        >
          <template v-slot:contenido-adicional>
            <div class="text-h4 text-bold text-center q-mb-xl">
              <span class="text-decoration-underline">{{ dueDiligenceData.titular.titulo }}</span>
            </div>
          </template>
        </ModuloMedia>
      </div>

      <!-- Módulo de galería de imágenes (Imagen 3) -->
      <div class="q-mb-xl">
        <ModuloGaleria
          :titulo="dueDiligenceData.galeriaImagenes.titulo"
          :descripcion="dueDiligenceData.galeriaImagenes.descripcion"
          :items="imagenesFormateadas"
          :tipo-galeria="'imagenes'"
          :columnas-desktop="3"
          :columnas-tablet="2"
          :columnas-mobile="1"
          :borde="true"
          :borde-items="true"
          :espaciado="'normal'"
        />
      </div>

      <!-- Módulo Imagen a la izquierda y Texto a la derecha (Imagen 4) -->
      <div class="q-mb-xl">
        <ModuloMedia
          :titulo="dueDiligenceData.seccionImagen.titulo"
          :texto="dueDiligenceData.seccionImagen.texto"
          :media-url="dueDiligenceData.seccionImagen.imagenUrl"
          :titulo-media="dueDiligenceData.seccionImagen.imagenTitulo"
          :posicion-media="'left'"
          :distribucion-columnas="'4-8'"
          :titulo-clase="'text-h5 text-bold'"
          :media-ratio="1"
          :borde="true"
          :espaciado="'normal'"
        />
      </div>

      <!-- Módulo Texto e Imagen Flexible (Imagen 5) -->
      <div class="q-mb-xl">
        <ModuloMedia
          :titulo="dueDiligenceData.seccionFinal.titulo"
          :texto="dueDiligenceData.seccionFinal.texto"
          :media-url="dueDiligenceData.seccionFinal.imagenUrl"
          :titulo-media="dueDiligenceData.seccionFinal.imagenTitulo"
          :posicion-media="'right'"
          :distribucion-columnas="'7-5'"
          :titulo-clase="'text-h5 text-bold'"
          :media-ratio="4/3"
          :borde="true"
          :espaciado="'normal'"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { mockData } from '~/data/mockData.js';

// Importar componentes base
import ModuloBanner from '~/components/certiffy/base/ModuloBanner.vue';
import ModuloMedia from '~/components/certiffy/base/ModuloMedia.vue';
import ModuloGaleria from '~/components/certiffy/base/ModuloGaleria.vue';

// Para desarrollo usamos los datos mock
const dueDiligenceData = ref(mockData.dueDiligence);

// Formatear imágenes para la galería
const imagenesFormateadas = computed(() => {
  return dueDiligenceData.value.galeriaImagenes.imagenes.map(img => ({
    imagenUrl: img.url,
    titulo: img.titulo || ''
  }));
});
</script>

<style scoped>
.certiffy-pagina {
  padding: 2rem 0;
}

.certiffy-contenedor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
