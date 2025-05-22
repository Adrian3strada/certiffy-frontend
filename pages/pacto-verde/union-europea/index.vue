<template>
  <q-page class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px">
      <BannerPrincipalModulo
        :titulo="unionEuropeaData.banner.titulo"
        :imagen-url="unionEuropeaData.banner.imagenUrl"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloTextoDocumentos
          :titulo="unionEuropeaData.textoDocumentos.titulo"
          :descripcion="unionEuropeaData.textoDocumentos.descripcion"
          :documentos="unionEuropeaData.textoDocumentos.documentos"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloGaleriaImagenes
          :titulo="unionEuropeaData.galeriaImagenes.titulo"
          :descripcion="unionEuropeaData.galeriaImagenes.descripcion"
          :imagenes="unionEuropeaData.galeriaImagenes.imagenes"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoImagen
          :titulo="unionEuropeaData.masSecciones.titulo"
          :texto="unionEuropeaData.masSecciones.texto"
          :imagen-url="unionEuropeaData.masSecciones.imagenUrl"
          :imagen-titulo="unionEuropeaData.masSecciones.imagenTitulo"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConRegresar
          :texto="unionEuropeaData.seccionFinal.texto"
          @regresar="onRegresar"
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
import ModuloTextoDocumentos from '~/components/certiffy/pacto-verde/ModuloTextoDocumentos.vue';
import ModuloGaleriaImagenes from '~/components/certiffy/pacto-verde/ModuloGaleriaImagenes.vue';
import ModuloTextoImagen from '~/components/certiffy/pacto-verde/ModuloTextoImagen.vue';
import ModuloTextoConRegresar from '~/components/certiffy/trazabilidad/ModuloTextoConRegresar.vue';

const unionEuropeaData = ref(mockData.unionEuropea);

function onRegresar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
