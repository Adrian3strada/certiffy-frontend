<template>
  <q-page class="certiffy-pagina">
    <div class="certiffy-contenedor">
      <ModuloBanner
        :tamanio-banner="'normal'"
        :imagen-fondo="unionEuropeaData.banner.imagenUrl"
        :usar-overlay="true"
        :titulo="unionEuropeaData.banner.titulo"
        :titulo-clase="'text-h1 text-weight-bold text-white'"
        :color-overlay="'rgba(0, 0, 0, 0.4)'"
        :posicion-texto="'center'"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloGaleria
          :titulo="unionEuropeaData.textoDocumentos.titulo"
          :descripcion="unionEuropeaData.textoDocumentos.descripcion"
          :items="documentosFormateados"
          :tipo-galeria="'documentos'"
          :columnas-desktop="3"
          :columnas-tablet="2"
          :columnas-mobile="1"
          :borde="true"
          :borde-items="true"
          :efecto-elevacion-items="true"
          :espaciado="'normal'"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloGaleria
          :titulo="unionEuropeaData.galeriaImagenes.titulo"
          :descripcion="unionEuropeaData.galeriaImagenes.descripcion"
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

      <div class="q-mb-xl">
        <ModuloMedia
          :titulo="unionEuropeaData.masSecciones.titulo"
          :texto="unionEuropeaData.masSecciones.texto"
          :media-url="unionEuropeaData.masSecciones.imagenUrl"
          :titulo-media="unionEuropeaData.masSecciones.imagenTitulo"
          :posicion-media="'right'"
          :distribucion-columnas="'7-5'"
          :titulo-clase="'text-h5 text-bold'"
          :media-ratio="4/3"
          :borde="true"
          :espaciado="'normal'"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloBase :tamanio="'md'" :espaciado="'amplio'" :borde="true" card-clase="bg-purple-1">
          <q-card-section>
            <div class="text-body1 q-mb-xl">{{ unionEuropeaData.seccionFinal.texto }}</div>
            
            <div class="row justify-end">
              <q-btn 
                color="grey-4" 
                text-color="black" 
                class="q-px-md text-weight-bold" 
                @click="onRegresar"
                unelevated
              >REGRESAR</q-btn>
            </div>
          </q-card-section>
        </ModuloBase>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { mockData } from '~/data/mockData.js';

// Importar componentes base
import ModuloBanner from '~/components/certiffy/base/ModuloBanner.vue';
import ModuloGaleria from '~/components/certiffy/base/ModuloGaleria.vue';
import ModuloMedia from '~/components/certiffy/base/ModuloMedia.vue';
import ModuloBase from '~/components/certiffy/base/ModuloBase.vue';

const unionEuropeaData = ref(mockData.unionEuropea);

const documentosFormateados = computed(() => {
  return unionEuropeaData.value.textoDocumentos.documentos.map(doc => ({
    titulo: doc.titulo,
    url: doc.url,
    icono: 'description',
    accion: 'Ver documento'
  }));
});

const imagenesFormateadas = computed(() => {
  return unionEuropeaData.value.galeriaImagenes.imagenes.map(img => ({
    imagenUrl: img.url,
    titulo: img.titulo || ''
  }));
});

function onRegresar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
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
