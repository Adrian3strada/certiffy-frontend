<template>
  <section class="q-py-xl q-px-md bg-grey-1">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold">{{ title }}</div>
      </div>
      
      <div class="row q-col-gutter-lg justify-center">
        <div v-for="(noticia, index) in noticias" :key="index" class="col-12 col-md-4">
          <q-card 
            class="h-100 q-hoverable shadow-1" 
            bordered
            style="transition: transform 0.3s ease, box-shadow 0.3s ease"
            :style="{ transform: 'translateY(0)' }"
            @mouseover="e => e.target.style.transform = 'translateY(-5px)'"
            @mouseleave="e => e.target.style.transform = 'translateY(0)'"
          >
            <q-img
              :src="noticia.imagen"
              :ratio="16/9"
              spinner-color="primary"
              spinner-size="40px"
            />
            
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold">{{ noticia.titulo }}</q-item-label>
                  <q-item-label caption class="q-mt-xs text-grey-8">{{ noticia.fecha }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm text-body2" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                    {{ noticia.descripcion }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
            
            <q-card-actions align="right">
              <q-btn 
                color="primary" 
                :to="noticia.url" 
                flat
                label="Leer más" 
                icon-right="arrow_forward"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
      
      <div class="text-center q-mt-xl">
        <q-btn 
          color="primary" 
          :to="verMasUrl" 
          label="Ver todas las noticias" 
          unelevated
          rounded
          class="q-px-xl q-py-sm"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWagtailApi } from '~/composables/useWagtailApi';

const props = defineProps({
  title: {
    type: String,
    default: 'NOTICIAS Y EVENTOS'
  },
  noticias: {
    type: Array,
    default: () => []
  },
  verMasUrl: {
    type: String,
    default: '/noticias-y-eventos'
  },
  maxItems: {
    type: Number,
    default: 3
  }
});

const { getLatestNews, loading, error } = useWagtailApi();
const noticiasData = ref(props.noticias);

// Si no se proporcionan noticias a través de props, intentamos obtenerlas de la API
onMounted(async () => {
  if (noticiasData.value.length === 0) {
    try {
      const data = await getLatestNews(props.maxItems);
      if (data && Array.isArray(data)) {
        noticiasData.value = data;
      } else {
        // Usar datos de ejemplo si no se pueden obtener de la API
        noticiasData.value = [
          {
            titulo: 'CERTIFFY X AGROJAL',
            descripcion: 'Alianza estratégica para mejorar la trazabilidad en la cadena de suministro agrícola y garantizar la calidad de los productos.',
            imagen: 'https://placehold.co/600x400/eef8ff/2196f3?text=CERTIFFY+X+AGROJAL',
            fecha: '10 de mayo de 2025',
            url: '/noticias/certiffy-agrojal'
          },
          {
            titulo: 'TITULO DE LA NOTICIA',
            descripcion: 'Nueva actualización de nuestra plataforma de certificación con funcionalidades mejoradas para la gestión de documentos.',
            imagen: 'https://placehold.co/600x400/e6f9e6/4caf50?text=NOTICIA',
            fecha: '2 de mayo de 2025',
            url: '/noticias/actualizacion-plataforma'
          },
          {
            titulo: 'TITULO DE LA NOTICIA',
            descripcion: 'Webinar sobre las nuevas normativas europeas de certificación y cómo CERTIFFY puede ayudar a cumplirlas.',
            imagen: 'https://placehold.co/600x400/e6f9e6/4caf50?text=NOTICIA',
            fecha: '28 de abril de 2025',
            url: '/noticias/webinar-normativas'
          }
        ];
      }
    } catch (err) {
      console.error('Error al obtener noticias:', err);
    }
  }
});
</script>