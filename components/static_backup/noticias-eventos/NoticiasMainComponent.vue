<template>
  <section class="q-py-lg">
    <div class="q-mx-auto" style="max-width: 1200px;">
      <!-- Banner principal de noticias -->
      <NoticiasBannerComponent 
        v-if="noticiasData.banner"
        :titulo="noticiasData.banner.titulo"
        :descripcion="noticiasData.banner.descripcion"
        :imagenUrl="noticiasData.banner.imagenUrl"
        :categoria="noticiasData.banner.categoria"
        class="q-mb-xl"
      />

      <div class="row q-col-gutter-lg q-mb-xl">
        <!-- Artículo principal -->
        <div class="col-12 col-md-7">
          <NoticiaArticuloComponent 
            v-if="noticiasData.articuloPrincipal"
            :titulo="noticiasData.articuloPrincipal.titulo"
            :contenido="noticiasData.articuloPrincipal.contenido"
            :fecha="noticiasData.articuloPrincipal.fecha"
          />
        </div>
        
        <!-- Columna lateral -->
        <div class="col-12 col-md-5">
          <NoticiaImagenSecundariaComponent 
            v-if="noticiasData.imagenSecundaria"
            :imagenUrl="noticiasData.imagenSecundaria.imagenUrl"
            :caption="noticiasData.imagenSecundaria.caption"
            class="q-mb-md"
          />
          
          <NoticiaArticuloSecundarioComponent 
            v-if="noticiasData.articuloSecundario"
            :titulo="noticiasData.articuloSecundario.titulo"
            :contenido="noticiasData.articuloSecundario.contenido"
            class="q-mb-md"
          />
          
          <NoticiaImagenTerciariaComponent 
            v-if="noticiasData.imagenTerciaria"
            :imagenUrl="noticiasData.imagenTerciaria.imagenUrl"
            :caption="noticiasData.imagenTerciaria.caption"
          />
        </div>
      </div>

      <!-- Cuadrícula de noticias adicionales -->
      <NoticiasCuadriculaComponent 
        v-if="noticiasData.noticiasAdicionales"
        :noticias="noticiasData.noticiasAdicionales"
        :notaInformativa="noticiasData.notaInformativa"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import NoticiasBannerComponent from './NoticiasBannerComponent.vue';
import NoticiaArticuloComponent from './NoticiaArticuloComponent.vue';
import NoticiaImagenSecundariaComponent from './NoticiaImagenSecundariaComponent.vue';
import NoticiaArticuloSecundarioComponent from './NoticiaArticuloSecundarioComponent.vue';
import NoticiaImagenTerciariaComponent from './NoticiaImagenTerciariaComponent.vue';
import NoticiasCuadriculaComponent from './NoticiasCuadriculaComponent.vue';


// Definir props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

// Combinar datos recibidos por props con los datos por defecto
const noticiasData = computed(() => {
  return {
    ...defaultData,
    ...props.data
  };
});
</script>
