<template>
  <q-page class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Banner principal (Imagen 1) -->
      <BannerPrincipalModulo
        :titulo="dueDiligenceData.banner.titulo"
        :imagen-url="dueDiligenceData.banner.imagenUrl"
      />

      <!-- Módulo Titular con Texto y Foto (Imagen 2) -->
      <div class="q-mt-xl q-mb-xl">
        <ModuloTitularTextoFoto
          :titulo="dueDiligenceData.titular.titulo"
          :subtitulo="dueDiligenceData.titular.subtitulo"
          :descripcion="dueDiligenceData.titular.descripcion"
          :imagen-url="dueDiligenceData.titular.imagenUrl"
          :imagen-titulo="dueDiligenceData.titular.imagenTitulo"
        />
      </div>

      <!-- Módulo de galería de imágenes (Imagen 3) -->
      <div class="q-mb-xl">
        <ModuloGaleriaImagenes
          :titulo="dueDiligenceData.galeriaImagenes.titulo"
          :descripcion="dueDiligenceData.galeriaImagenes.descripcion"
          :imagenes="dueDiligenceData.galeriaImagenes.imagenes"
        />
      </div>

      <!-- Módulo Imagen a la izquierda y Texto a la derecha (Imagen 4) -->
      <div class="q-mb-xl">
        <ModuloImagenTexto
          :titulo="dueDiligenceData.seccionImagen.titulo"
          :texto="dueDiligenceData.seccionImagen.texto"
          :imagen-url="dueDiligenceData.seccionImagen.imagenUrl"
          :imagen-titulo="dueDiligenceData.seccionImagen.imagenTitulo"
        />
      </div>

      <!-- Módulo Texto e Imagen Flexible (Imagen 5) -->
      <div class="q-mb-xl">
        <ModuloTextoFoto
          :titulo="dueDiligenceData.seccionFinal.titulo"
          :texto="dueDiligenceData.seccionFinal.texto"
          :imagen-url="dueDiligenceData.seccionFinal.imagenUrl"
          :imagen-titulo="dueDiligenceData.seccionFinal.imagenTitulo"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { mockData } from '~/data/mockData.js';

// Importar componentes
import BannerPrincipalModulo from '~/components/certiffy/trazabilidad/BannerPrincipalModulo.vue';
import ModuloTitularTextoFoto from '~/components/certiffy/pacto-verde/ModuloTitularTextoFoto.vue';
import ModuloGaleriaImagenes from '~/components/certiffy/pacto-verde/ModuloGaleriaImagenes.vue';
import ModuloImagenTexto from '~/components/certiffy/pacto-verde/ModuloImagenTexto.vue';
import ModuloTextoFoto from '~/components/certiffy/pacto-verde/ModuloTextoFoto.vue';

// Para desarrollo usamos los datos mock
const dueDiligenceData = ref(mockData.dueDiligence);
</script>
