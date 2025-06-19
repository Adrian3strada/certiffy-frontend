<template>
  <div 
    class="certiffy-tarjeta q-pa-md"
    :class="[
      tarjetaClase,
      { 'certiffy-tarjeta--hover': efectoHover }
    ]"
  >
    <q-card
      :flat="!borde"
      :bordered="borde"
      class="full-height"
    >
      <div class="certiffy-tarjeta__media" v-if="imagenUrl">
        <q-img
          :src="imagenUrl"
          :ratio="mediaRatio"
          spinner-color="accent"
          spinner-size="42px"
          :height="alturaImagen"
          :fit="ajusteImagen"
          class="certiffy-tarjeta__imagen"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center text-negative">
              <q-icon name="error" size="2rem" />
            </div>
          </template>
          <div 
            v-if="imagenOverlay" 
            class="absolute-bottom text-center"
            style="background: rgba(0,0,0,0.4)"
          >
            <div class="text-subtitle1 text-bold text-white q-py-sm">{{ imagenOverlay }}</div>
          </div>
        </q-img>
      </div>

      <q-card-section>
        <div 
          v-if="titulo" 
          class="q-mb-sm text-weight-bold line-height-sm"
          :class="tituloClase"
        >
          {{ titulo }}
        </div>
        
        <div 
          v-if="subtitulo" 
          class="q-mb-md line-height-md"
          :class="subtituloClase"
        >
          {{ subtitulo }}
        </div>
        
        <div 
          v-if="contenido" 
          class="line-height-lg"
          :class="contenidoClase"
        >
          {{ contenido }}
        </div>
        
        <slot name="contenido-personalizado"></slot>
      </q-card-section>
      
      <q-card-actions v-if="mostrarAcciones" align="right" class="q-mt-auto q-pt-md">
        <slot name="acciones">
          <q-btn 
            v-if="accionPrimaria"
            :label="accionPrimaria" 
            :color="colorAccionPrimaria" 
            :to="rutaAccionPrimaria" 
            :outline="outlineAccionPrimaria"
            no-caps
          />
          <q-btn 
            v-if="accionSecundaria"
            :label="accionSecundaria" 
            :color="colorAccionSecundaria" 
            :to="rutaAccionSecundaria" 
            :outline="outlineAccionSecundaria"
            flat
            no-caps
          />
        </slot>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Apariencia
  borde: { type: Boolean, default: true },
  efectoHover: { type: Boolean, default: true },
  tarjetaClase: { type: String, default: '' },
  
  // Contenido
  titulo: { type: String, default: '' },
  subtitulo: { type: String, default: '' },
  contenido: { type: String, default: '' },
  tituloClase: { type: String, default: 'text-h6 text-weight-bold' },
  subtituloClase: { type: String, default: 'text-subtitle1' },
  contenidoClase: { type: String, default: 'text-body2' },
  
  // Imagen
  imagenUrl: { type: String, default: '' },
  imagenOverlay: { type: String, default: '' },
  alturaImagen: { type: String, default: '200px' },
  ajusteImagen: { 
    type: String, 
    default: 'cover',
    validator: (value) => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
  },
  mediaRatio: { type: Number, default: 16/9 },
  
  // Acciones
  accionPrimaria: { type: String, default: '' },
  rutaAccionPrimaria: { type: [String, Object], default: '#' },
  colorAccionPrimaria: { type: String, default: 'secondary' },
  outlineAccionPrimaria: { type: Boolean, default: false },
  accionSecundaria: { type: String, default: '' },
  rutaAccionSecundaria: { type: [String, Object], default: '#' },
  colorAccionSecundaria: { type: String, default: 'warning' },
  outlineAccionSecundaria: { type: Boolean, default: true }
});

// Determinar si mostrar las acciones
const mostrarAcciones = computed(() => {
  return props.accionPrimaria || props.accionSecundaria;
});
</script>

<style scoped>
/* Estilos para la tarjeta */
.certiffy-tarjeta {
  transition: all 0.3s ease;
}

.certiffy-tarjeta--hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Estilos para la imagen */
.certiffy-tarjeta__imagen {
  transition: all 0.3s ease;
}

/* Define line heights for text elements */
.line-height-sm { line-height: 1.2; }
.line-height-md { line-height: 1.4; }
.line-height-lg { line-height: 1.6; }
</style>
