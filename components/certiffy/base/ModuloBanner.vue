<template>
  <div 
    class="certiffy-banner q-mb-xl"
    :class="[
      `certiffy-banner--${tamanioBanner}`,
      { 'certiffy-banner--overlay': usarOverlay }
    ]"
    :style="estiloFondo"
  >
    <div class="certiffy-banner__contenido">
      <div class="row items-center">
        <div 
          class="col-12"
          :class="[posicionTextoClase]"
        >
          <div class="certiffy-banner__texto q-pa-xl">
            <div 
              v-if="titulo" 
              class="certiffy-banner__titulo q-mb-md"
              :class="tituloClase"
            >
              {{ titulo }}
            </div>
            
            <div 
              v-if="subtitulo" 
              class="certiffy-banner__subtitulo q-mb-lg"
              :class="subtituloClase"
            >
              {{ subtitulo }}
            </div>
            
            <div 
              v-if="descripcion" 
              class="certiffy-banner__descripcion q-mb-xl"
              :class="descripcionClase"
            >
              {{ descripcion }}
            </div>
            
            <slot name="contenido-adicional"></slot>
            
            <div v-if="mostrarAcciones" class="certiffy-banner__acciones q-mt-lg">
              <slot name="acciones">
                <q-btn 
                  v-if="accionPrimaria"
                  :label="accionPrimaria" 
                  :color="colorAccionPrimaria" 
                  :to="rutaAccionPrimaria" 
                  :outline="outlineAccionPrimaria"
                  class="q-mr-md"
                  size="lg"
                />
                <q-btn 
                  v-if="accionSecundaria"
                  :label="accionSecundaria" 
                  :color="colorAccionSecundaria" 
                  :to="rutaAccionSecundaria" 
                  :outline="outlineAccionSecundaria"
                  size="lg"
                />
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Tamaño y apariencia
  tamanioBanner: {
    type: String,
    default: 'normal',
    validator: (value) => ['pequeno', 'normal', 'grande', 'completo'].includes(value)
  },
  
  // Fondo
  imagenFondo: { type: String, default: '' },
  colorFondo: { type: String, default: '' },
  usarOverlay: { type: Boolean, default: true },
  colorOverlay: { type: String, default: 'rgba(0, 0, 0, 0.4)' },
  
  // Contenido
  titulo: { type: String, default: '' },
  subtitulo: { type: String, default: '' },
  descripcion: { type: String, default: '' },
  tituloClase: { type: String, default: 'text-h2 text-weight-bold text-white' },
  subtituloClase: { type: String, default: 'text-h5 text-white' },
  descripcionClase: { type: String, default: 'text-body1 text-white' },
  
  // Alineación
  posicionTexto: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },
  
  // Acciones
  accionPrimaria: { type: String, default: '' },
  rutaAccionPrimaria: { type: [String, Object], default: '#' },
  colorAccionPrimaria: { type: String, default: 'white' },
  outlineAccionPrimaria: { type: Boolean, default: false },
  accionSecundaria: { type: String, default: '' },
  rutaAccionSecundaria: { type: [String, Object], default: '#' },
  colorAccionSecundaria: { type: String, default: 'white' },
  outlineAccionSecundaria: { type: Boolean, default: true }
});

// Estilos de fondo
const estiloFondo = computed(() => {
  const estilos = {};
  
  if (props.imagenFondo) {
    estilos.backgroundImage = `url(${props.imagenFondo})`;
    estilos.backgroundSize = 'cover';
    estilos.backgroundPosition = 'center';
  }
  
  if (props.colorFondo) {
    estilos.backgroundColor = props.colorFondo;
  }
  
  return estilos;
});

// Clases para la posición del texto
const posicionTextoClase = computed(() => {
  const mapa = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  };
  return mapa[props.posicionTexto] || mapa.center;
});

// Determinar si mostrar las acciones
const mostrarAcciones = computed(() => {
  return props.accionPrimaria || props.accionSecundaria;
});
</script>

<style scoped>
.certiffy-banner {
  position: relative;
  width: 100%;
  background-color: var(--q-primary);
}

.certiffy-banner--pequeno {
  height: 200px;
}

.certiffy-banner--normal {
  height: 300px;
}

.certiffy-banner--grande {
  height: 400px;
}

.certiffy-banner--completo {
  height: 100vh;
  min-height: 500px;
}

.certiffy-banner--overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: v-bind('props.colorOverlay');
  z-index: 1;
}

.certiffy-banner__contenido {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.certiffy-banner__texto {
  max-width: 800px;
  margin: 0 auto;
}

.certiffy-banner__titulo {
  line-height: 1.2;
}

.certiffy-banner__subtitulo {
  line-height: 1.4;
}

.certiffy-banner__descripcion {
  line-height: 1.6;
}

.certiffy-banner__acciones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.certiffy-banner__acciones .q-btn {
  margin-bottom: 1rem;
}
</style>
