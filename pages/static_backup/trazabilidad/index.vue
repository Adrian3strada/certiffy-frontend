<template>
  <q-page class="certiffy-pagina">
    <div class="certiffy-contenedor">
      <!-- Banner principal -->
      <ModuloBanner
        :tamanio-banner="'normal'"
        :imagen-fondo="trazabilidadData.banner.imagenUrl"
        :usar-overlay="true"
        :titulo="trazabilidadData.banner.titulo"
        :titulo-clase="'text-h1 text-weight-bold text-white'"
        :color-overlay="'rgba(0, 0, 0, 0.4)'"
        :posicion-texto="'center'"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloMedia
          :titulo="trazabilidadData.seccion1.subtitulo"
          :texto="trazabilidadData.seccion1.texto"
          :media-url="trazabilidadData.seccion1.imagenUrl"
          :titulo-media="'FOTO 1'"
          :posicion-media="'left'"
          :distribucion-columnas="'4-8'"
          :titulo-clase="'text-h5 text-bold'"
          :media-ratio="1"
          :borde="true"
          :espaciado="'normal'"
        >
          <template v-slot:contenido-adicional>
            <div class="text-h4 text-bold text-center q-mb-xl">
              <span class="text-decoration-underline">{{ trazabilidadData.seccion1.titulo }}</span>
            </div>
          </template>
        </ModuloMedia>
      </div>

      <div class="q-mb-xl">
        <ModuloMedia
          :texto="trazabilidadData.seccion2.texto"
          :media-url="trazabilidadData.seccion2.imagenUrl"
          :titulo-media="'FOTO 2'"
          :posicion-media="'right'"
          :distribucion-columnas="'7-5'"
          :media-ratio="4/3"
          :borde="true"
          :espaciado="'normal'"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloBase :tamanio="'md'" :espaciado="'amplio'" :borde="true" card-clase="bg-purple-1">
          <q-card-section>
            <div class="text-h4 text-bold q-mb-md">(TEXTO #3)</div>
            <div class="text-body1 q-mb-xl">{{ trazabilidadData.seccion3.texto }}</div>
            
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
import { ref } from 'vue';
import { mockData } from '~/data/mockData.js';
import ModuloBanner from '~/components/certiffy/base/ModuloBanner.vue';
import ModuloMedia from '~/components/certiffy/base/ModuloMedia.vue';
import ModuloBase from '~/components/certiffy/base/ModuloBase.vue';

const trazabilidadData = ref(mockData.trazabilidad);

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
