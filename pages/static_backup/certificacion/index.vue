<template>
  <q-page class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Banner principal -->
      <BannerPrincipalModulo
        :titulo="certificacionData.banner.titulo"
        :imagen-url="certificacionData.banner.imagenUrl"
      />

      <div class="q-mt-xl q-mb-xl">
        <ModuloInfoSeccion
          :titulo="certificacionData.seccion1.titulo"
          :descripcion="certificacionData.seccion1.texto"
          :imagen-fondo="certificacionData.seccion1.imagenUrl"
          posicion-texto="centro-enmarcado"
          alineacion-texto="izquierda"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloMedia
          :texto="certificacionData.seccion2.texto"
          :media-url="certificacionData.seccion2.imagenUrl"
          posicion-media="right"
          :texto-sobre-media="false"
        />
      </div>

      <div class="q-mb-xl">
        <ModuloBase>
          <q-card-section>
            <div class="text-body1 q-mb-md">{{ certificacionData.seccion3.texto }}</div>
            <q-btn label="Volver arriba" color="primary" @click="onRegresar" />
          </q-card-section>
        </ModuloBase>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { mockData } from '~/data/mockData.js';
import BannerPrincipalModulo from '~/components/certiffy/trazabilidad/BannerPrincipalModulo.vue';
import ModuloInfoSeccion from '~/components/certiffy/base/ModuloInfoSeccion.vue';
import ModuloMedia from '~/components/certiffy/base/ModuloMedia.vue';
import ModuloBase from '~/components/certiffy/base/ModuloBase.vue';

const certificacionData = ref(mockData.certificacion);

function onRegresar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
