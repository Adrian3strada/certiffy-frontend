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
          spinner-color="primary"
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
          class="certiffy-tarjeta__titulo q-mb-sm"
          :class="tituloClase"
        >
          {{ titulo }}
        </div>
        
        <div 
          v-if="subtitulo" 
          class="certiffy-tarjeta__subtitulo q-mb-md"
          :class="subtituloClase"
        >
          {{ subtitulo }}
        </div>
        
        <div 
          v-if="contenido" 
          class="certiffy-tarjeta__contenido"
          :class="contenidoClase"
        >
          {{ contenido }}
        </div>
        
        <slot name="contenido-personalizado"></slot>
      </q-card-section>
      
      <q-card-actions v-if="mostrarAcciones" align="right" class="certiffy-tarjeta__acciones">
        <slot name="acciones">
          <q-btn 
            v-if="accionPrimaria"
            :label="accionPrimaria" 
            :color="colorAccionPrimaria" 
            :to="rutaAccionPrimaria" 
            :outline="outlineAccionPrimaria"
            class="certiffy-tarjeta__boton"
          />
          <q-btn 
            v-if="accionSecundaria"
            :label="accionSecundaria" 
            :color="colorAccionSecundaria" 
            :to="rutaAccionSecundaria" 
            :outline="outlineAccionSecundaria"
            flat
            class="certiffy-tarjeta__boton"
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
  colorAccionPrimaria: { type: String, default: 'primary' },
  outlineAccionPrimaria: { type: Boolean, default: false },
  accionSecundaria: { type: String, default: '' },
  rutaAccionSecundaria: { type: [String, Object], default: '#' },
  colorAccionSecundaria: { type: String, default: 'secondary' },
  outlineAccionSecundaria: { type: Boolean, default: true }
});

// Determinar si mostrar las acciones
const mostrarAcciones = computed(() => {
  return props.accionPrimaria || props.accionSecundaria;
});
</script>

<style scoped>
.certiffy-tarjeta {
  height: 100%;
}

.certiffy-tarjeta--hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.certiffy-tarjeta--hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.certiffy-tarjeta--hover:hover .certiffy-tarjeta__imagen {
  transform: translateY(5px);
  opacity: 0.8;
}

.certiffy-tarjeta--hover:hover .certiffy-tarjeta__boton {
  transform: translateY(0);
  opacity: 1;
}

.certiffy-tarjeta__titulo {
  line-height: 1.2;
}

.certiffy-tarjeta__subtitulo {
  line-height: 1.4;
}

.certiffy-tarjeta__contenido {
  line-height: 1.6;
}

.certiffy-tarjeta__acciones {
  margin-top: auto;
  padding-top: 1rem;
}

/* Fix para alineación de botones */
.q-card {
  display: flex;
  flex-direction: column;
}

.q-card .q-card__section {
  flex-grow: 1;
}
</style>
