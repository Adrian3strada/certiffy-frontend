<template>
  <q-page class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Banner principal -->
      <BannerPrincipalModulo
        :titulo="trazabilidadData.banner.titulo"
        :imagen-url="trazabilidadData.banner.imagenUrl"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloDetalleFotoTexto
          :titulo="trazabilidadData.seccion1.titulo"
          :subtitulo="trazabilidadData.seccion1.subtitulo"
          :descripcion="trazabilidadData.seccion1.texto"
          :imagen-url="trazabilidadData.seccion1.imagenUrl"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConFoto
          :texto="trazabilidadData.seccion2.texto"
          :imagen-url="trazabilidadData.seccion2.imagenUrl"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConRegresar
          :texto="trazabilidadData.seccion3.texto"
          @regresar="onRegresar"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { mockData } from '~/data/mockData.js';
import BannerPrincipalModulo from '~/components/certiffy/trazabilidad/BannerPrincipalModulo.vue';
import ModuloDetalleFotoTexto from '~/components/certiffy/trazabilidad/ModuloDetalleFotoTexto.vue';
import ModuloTextoConFoto from '~/components/certiffy/trazabilidad/ModuloTextoConFoto.vue';
import ModuloTextoConRegresar from '~/components/certiffy/trazabilidad/ModuloTextoConRegresar.vue';

const trazabilidadData = ref(mockData.trazabilidad);

function onRegresar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.q-page {
  max-width: 900px;
  margin: auto;
}
</style>
