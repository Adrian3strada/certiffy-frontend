<template>
  <section class="q-py-xl q-px-md bg-grey-1">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold">{{ title }}</div>
      </div>
      
      <div class="row q-col-gutter-lg justify-center">
        <div v-for="(noticia, index) in noticiasData" :key="index" class="col-12 col-md-4">
          <q-card 
            class="noticia-card h-100 q-hoverable shadow-1" 
            bordered
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
                  <q-item-label class="noticia-descripcion q-mt-sm text-body2">
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
                :label="botonLeerMasTexto" 
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
          :label="botonVerTodasTexto" 
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
    required: true
  },
  noticias: {
    type: Array,
    required: true
  },
  verMasUrl: {
    type: String,
    required: true
  },
  maxItems: {
    type: Number,
    default: 3
  },
  botonLeerMasTexto: {
    type: String,
    required: true
  },
  botonVerTodasTexto: {
    type: String,
    required: true
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
      }
    } catch (err) {
      console.error('Error al obtener noticias:', err);
    }
  }
});
</script>

<style scoped>
.noticia-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.noticia-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.noticia-descripcion {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .q-card-section {
    padding: 12px !important;
  }
  
  .q-item {
    padding: 8px 0 !important;
  }
  
  .text-subtitle1 {
    font-size: 1rem !important;
  }
  
  .text-body2 {
    font-size: 0.875rem !important;
  }
  
  .q-btn {
    font-size: 0.8rem !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .text-h4 {
    font-size: 1.75rem !important;
  }
  
  .q-card-section {
    padding: 16px !important;
  }
}
</style>