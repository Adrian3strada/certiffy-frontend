<template>
  <q-page class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Banner principal -->
      <BannerPrincipalModulo
        :titulo="certificacionData.banner.titulo"
        :imagen-url="certificacionData.banner.imagenUrl"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloDetalleFotoTexto
          :titulo="certificacionData.seccion1.titulo"
          :subtitulo="certificacionData.seccion1.subtitulo"
          :descripcion="certificacionData.seccion1.texto"
          :imagen-url="certificacionData.seccion1.imagenUrl"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConFoto
          :texto="certificacionData.seccion2.texto"
          :imagen-url="certificacionData.seccion2.imagenUrl"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConRegresar
          :texto="certificacionData.seccion3.texto"
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

const certificacionData = ref(mockData.certificacion);

function onRegresar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
