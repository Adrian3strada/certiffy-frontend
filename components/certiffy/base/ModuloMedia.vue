<template>
  <ModuloBase
    :tamanio="tamanio"
    :espaciado="espaciado"
    :ancho-completo="anchoCompleto"
    :borde="borde"
    :efecto-elevacion="efectoElevacion"
    :card-clase="cardClase"
  >
    <q-card-section>
      <div class="row q-col-gutter-md" :class="{ 'flex-row-reverse': posicionMedia === 'left' }">
        <!-- Columna de contenido textual cuando no está sobre la imagen -->
        <div v-if="!textoSobreMedia && posicionMedia !== 'background'" :class="columnaTextoClase">
          <div 
            v-if="titulo" 
            class="text-weight-bold certiffy-media-titulo q-mb-md"
            :class="[tituloClase, alineacionTituloClase]"
          >
            {{ titulo }}
          </div>
          
          <div 
            v-if="subtitulo" 
            class="certiffy-media-subtitulo q-mb-md"
            :class="[subtituloClase, alineacionTituloClase]"
          >
            {{ subtitulo }}
          </div>
          
          <div 
            v-if="texto" 
            class="certiffy-media-texto q-mb-md"
            :class="[textoClase, alineacionTextoClase]"
          >
            {{ texto }}
          </div>
          
          <slot name="contenido-adicional"></slot>
          
          <div v-if="mostrarAcciones" class="q-mt-md" :class="alineacionTextoClase">
            <slot name="acciones">
              <q-btn 
                v-if="accionPrimaria"
                :label="accionPrimaria" 
                :color="colorAccionPrimaria" 
                :to="rutaAccionPrimaria" 
                :outline="outlineAccionPrimaria"
                class="q-mr-sm"
              />
              <q-btn 
                v-if="accionSecundaria"
                :label="accionSecundaria" 
                :color="colorAccionSecundaria" 
                :to="rutaAccionSecundaria" 
                :outline="outlineAccionSecundaria"
              />
            </slot>
          </div>
        </div>
        
        <!-- Columna de media (imagen o video) -->
        <div v-if="tieneMedia" :class="[posicionMedia === 'background' ? 'col-12' : columnaMediaClase]">
          <q-card
            :flat="!bordeMedia"
            :bordered="bordeMedia"
            class="full-height full-width overflow-hidden"
          >
            <q-img
              :src="mediaUrl"
              :height="posicionMedia === 'background' ? '400px' : alturaMedia"
              :width="anchoMedia"
              :fit="ajusteMedia"
              :ratio="mediaRatio"
              class="full-width"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="image" size="2rem" color="grey-8" />
                </div>
              </template>
              
              <!-- Overlay para oscurecer la imagen si es necesario -->
              <div v-if="usarOverlay" class="absolute-full" :style="{ backgroundColor: colorOverlay }"></div>
              
              <!-- Texto sobre la imagen si está habilitado -->
              <div v-if="textoSobreMedia || posicionMedia === 'background'" class="absolute-full flex q-pa-lg">
                <div class="q-pa-md" style="width: 100%;">
                  <div 
                    v-if="titulo" 
                    class="text-weight-bold certiffy-media-titulo q-mb-md"
                    :class="[tituloClase, alineacionTituloClase]"
                  >
                    {{ titulo }}
                  </div>
                  
                  <div 
                    v-if="subtitulo" 
                    class="certiffy-media-subtitulo q-mb-md"
                    :class="[subtituloClase, alineacionTituloClase]"
                  >
                    {{ subtitulo }}
                  </div>
                  
                  <div 
                    v-if="texto" 
                    class="certiffy-media-texto q-mb-md"
                    :class="[textoClase, alineacionTextoClase]"
                  >
                    {{ texto }}
                  </div>
                  
                  <slot name="contenido-adicional"></slot>
                  
                  <div v-if="mostrarAcciones" class="q-mt-md" :class="alineacionTextoClase">
                    <slot name="acciones">
                      <q-btn 
                        v-if="accionPrimaria"
                        :label="accionPrimaria" 
                        :color="colorAccionPrimaria" 
                        :to="rutaAccionPrimaria" 
                        :outline="outlineAccionPrimaria"
                        class="q-mr-sm"
                      />
                      <q-btn 
                        v-if="accionSecundaria"
                        :label="accionSecundaria" 
                        :color="colorAccionSecundaria" 
                        :to="rutaAccionSecundaria" 
                        :outline="outlineAccionSecundaria"
                      />
                    </slot>
                  </div>
                </div>
              </div>
              
              <div v-if="tituloMedia && !textoSobreMedia && posicionMedia !== 'background'" 
                   class="absolute-bottom text-center bg-dark text-white q-pa-xs">
                {{ tituloMedia }}
              </div>
            </q-img>
          </q-card>
          
          <!-- Reemplazamos v-else con una condición explícita -->
          <slot v-if="!tieneMedia" name="media-personalizada"></slot>
        </div>
      </div>
    </q-card-section>
  </ModuloBase>
</template>

<script setup>
import { computed } from 'vue';
import ModuloBase from './ModuloBase.vue';

const props = defineProps({
  // Props del módulo base
  tamanio: { type: String, default: 'md' },
  espaciado: { type: String, default: 'normal' },
  anchoCompleto: { type: Boolean, default: false },
  borde: { type: Boolean, default: true },
  efectoElevacion: { type: Boolean, default: false },
  cardClase: { type: String, default: '' },
  
  // Contenido textual
  titulo: { type: String, default: '' },
  subtitulo: { type: String, default: '' },
  texto: { type: String, default: '' },
  tituloClase: { type: String, default: 'text-h4' },
  subtituloClase: { type: String, default: 'text-h6' },
  textoClase: { type: String, default: 'text-body1' },
  
  // Acciones
  accionPrimaria: { type: String, default: '' },
  rutaAccionPrimaria: { type: [String, Object], default: '#' },
  colorAccionPrimaria: { type: String, default: 'primary' },
  outlineAccionPrimaria: { type: Boolean, default: false },
  accionSecundaria: { type: String, default: '' },
  rutaAccionSecundaria: { type: [String, Object], default: '#' },
  colorAccionSecundaria: { type: String, default: 'secondary' },
  outlineAccionSecundaria: { type: Boolean, default: true },
  
  // Alineación del texto
  alineacionTitulo: {
    type: String,
    default: 'left',
    validator(value) { return ['left', 'center', 'right'].includes(value); }
  },
  alineacionTexto: {
    type: String,
    default: 'left',
    validator(value) { return ['left', 'center', 'right'].includes(value); }
  },
  
  // Media
  mediaUrl: { type: String, default: '' },
  tipoMedia: { 
    type: String, 
    default: 'imagen',
    validator(value) { return ['imagen', 'video', 'personalizado'].includes(value); }
  },
  tituloMedia: { type: String, default: '' },
  alturaMedia: { type: String, default: 'auto' },
  anchoMedia: { type: String, default: '100%' },
  ajusteMedia: { 
    type: String, 
    default: 'cover',
    validator(value) { return ['contain', 'cover', 'fill', 'none', 'scale-down'].includes(value); }
  },
  mediaRatio: { type: Number, default: 16/9 },
  bordeMedia: { type: Boolean, default: false },
  
  // Texto sobre imagen
  textoSobreMedia: { type: Boolean, default: false },
  usarOverlay: { type: Boolean, default: false },
  colorOverlay: { type: String, default: 'rgba(0, 0, 0, 0.5)' },
  
  // Layout
  posicionMedia: { 
    type: String, 
    default: 'right',
    validator(value) { return ['left', 'right', 'background'].includes(value); }
  },
  distribucionColumnas: {
    type: String,
    default: '6-6',
    validator(value) { return /^\d+-\d+$/.test(value); }
  }
});

// Verificar si hay media para mostrar
const tieneMedia = computed(() => {
  return props.mediaUrl || props.tipoMedia === 'personalizado';
});

// Determinar si mostrar las acciones
const mostrarAcciones = computed(() => {
  return props.accionPrimaria || props.accionSecundaria;
});

// Calcular clases para columnas según distribución y posición
const columnaTextoClase = computed(() => {
  if (['top', 'bottom'].includes(props.posicionMedia)) {
    return 'col-12';
  }
  
  const distribucion = props.distribucionColumnas.split('-');
  const colTexto = props.posicionMedia === 'left' ? distribucion[1] : distribucion[0];
  
  return `col-12 col-md-${colTexto}`;
});

const columnaMediaClase = computed(() => {
  if (['top', 'bottom'].includes(props.posicionMedia)) {
    return 'col-12';
  }
  
  const distribucion = props.distribucionColumnas.split('-');
  const colMedia = props.posicionMedia === 'left' ? distribucion[0] : distribucion[1];
  
  return `col-12 col-md-${colMedia}`;
});

// Clases para alineación de título
const alineacionTituloClase = computed(() => {
  const mapa = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  };
  return mapa[props.alineacionTitulo] || mapa.left;
});

// Clases para alineación de texto
const alineacionTextoClase = computed(() => {
  const mapa = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  };
  return mapa[props.alineacionTexto] || mapa.left;
});
</script>

<style scoped>
.certiffy-media-titulo {
  font-weight: bold;
  line-height: 1.2;
}

.certiffy-media-subtitulo {
  line-height: 1.4;
}

.certiffy-media-texto {
  line-height: 1.6;
}
</style>
