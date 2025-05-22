<template>
  <q-page class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Banner principal -->
      <BannerPrincipalModulo
        :titulo="administracionData.banner.titulo"
        :imagen-url="administracionData.banner.imagenUrl"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloDetalleFotoTexto
          :titulo="administracionData.seccion1.titulo"
          :subtitulo="administracionData.seccion1.subtitulo"
          :descripcion="administracionData.seccion1.texto"
          :imagen-url="administracionData.seccion1.imagenUrl"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConFoto
          :texto="administracionData.seccion2.texto"
          :imagen-url="administracionData.seccion2.imagenUrl"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloTextoConRegresar
          :texto="administracionData.seccion3.texto"
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

const administracionData = ref(mockData.administracion);

function onRegresar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
