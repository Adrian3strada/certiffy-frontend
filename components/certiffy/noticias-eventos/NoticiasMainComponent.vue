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

// Datos por defecto
const defaultData = {
  banner: {
    titulo: 'FOTO PRINCIPAL DE LA NOTA',
    descripcion: 'Descripción principal que acompaña a la foto destacada de la noticia',
    imagenUrl: 'https://images.pexels.com/photos/1353938/pexels-photo-1353938.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoria: 'CAFÉ'
  },
  articuloPrincipal: {
    titulo: 'TITULAR',
    contenido: 'Contenido principal del artículo. Aquí se incluye toda la información importante sobre la noticia o evento destacado.',
    fecha: 'FECHA'
  },
  imagenSecundaria: {
    imagenUrl: 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'FOTO #2'
  },
  articuloSecundario: {
    titulo: 'TEXTO #2',
    contenido: 'Contenido secundario que proporciona información adicional sobre el tema principal.'
  },
  imagenTerciaria: {
    imagenUrl: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'FOTO #3'
  },
  noticiasAdicionales: [
    {
      titulo: 'TITULO DE LA NOTICIA',
      imagenUrl: 'https://images.pexels.com/photos/1061588/pexels-photo-1061588.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      titulo: 'TITULO DE LA NOTICIA',
      imagenUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      titulo: 'TITULO DE LA NOTICIA',
      imagenUrl: 'https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=1200'
    }
  ],
  notaInformativa: 'Nota: no agregar títulos.... que las noticias se coloquen abajo de forma consecutiva a la que ya está desplegada.'
};

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
