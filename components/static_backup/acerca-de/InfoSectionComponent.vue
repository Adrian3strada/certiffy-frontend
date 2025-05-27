<template>
  <div class="info-section-component q-my-xl">
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <!-- Tarjeta con texto centrado sobre la imagen -->
        <q-card 
          class="info-card rounded-borders overflow-hidden"
          :class="cardClasses"
          flat
          :style="cardStyle"
        >
          <q-img
            :src="imagenFondo"
            :ratio="16/9"
            :placeholder-src="imagenPlaceholder"
          >
            <div class="absolute-full flex flex-center" :style="overlayStyle">
              <div class="text-container q-px-xl" :style="textWidthStyle">
                <div :class="`text-${alineacionTexto} full-width`">
                  <h2 :class="tituloClasses">{{ titulo }}</h2>
                  <q-separator 
                    v-if="mostrarSeparador"
                    :color="colorSeparador"
                    class="q-my-md"
                    size="2px"
                  />
                  <p :class="descripcionClasses">{{ descripcion }}</p>
                </div>
              </div>
            </div>
            <template v-slot:error>
              <div class="absolute-full flex flex-center" :style="{backgroundColor: props.colorOverlay}">
                <div class="text-container q-px-xl" :style="textWidthStyle">
                  <div :class="`text-${alineacionTexto} full-width`">
                    <h2 :class="tituloClasses">{{ titulo }}</h2>
                    <q-separator 
                      v-if="mostrarSeparador"
                      :color="colorSeparador"
                      class="q-my-md"
                      size="2px"
                    />
                    <p :class="descripcionClasses">{{ descripcion }}</p>
                  </div>
                </div>
              </div>
            </template>
          </q-img>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenFondo: { type: String, default: '' },
  imagenPlaceholder: { type: String, default: 'data:image/png...' },
  posicionTexto: { 
    type: String, 
    default: 'derecha',
    validator: v => ['izquierda', 'derecha', 'centro-enmarcado'].includes(v)
  },
  alineacionTexto: {
    type: String,
    default: 'izquierda',
    validator: v => ['izquierda', 'derecha', 'centro'].includes(v)
  },
  colorFondoError: { 
    type: String,
    default: 'primary'
  },
  efectoHover: { 
    type: Boolean, 
    default: true 
  },
  colorOverlay: { type: String, default: 'rgba(0, 0, 0, 0.6)' },
  colorTitulo: { type: String, default: 'white' },
  colorDescripcion: { type: String, default: 'white' },
  colorSeparador: { type: String, default: 'primary' },
  mostrarSeparador: { type: Boolean, default: true },
  overlayActivo: { type: Boolean, default: true },
  anchoTexto: { type: String, default: '80%' },
  altura: { type: String, default: '400px' }
});

const colorFondoClase = computed(() => {
  // Determinar un color basado en el título si colorFondoError no está definido
  if (!props.colorFondoError) {
    const tituloLower = props.titulo.toLowerCase();
    if (tituloLower.includes('misión')) return 'bg-blue-8';
    if (tituloLower.includes('visión')) return 'bg-green-8';
    if (tituloLower.includes('valores')) return 'bg-purple-8';
    return 'bg-primary';
  }
  return `bg-${props.colorFondoError}`;
});

const overlayStyle = computed(() => ({
  backgroundColor: props.colorOverlay,
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
}));

const cardStyle = computed(() => ({
  maxWidth: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  height: props.altura
}));

const textContainerStyle = computed(() => ({
  backgroundColor: props.overlayActivo ? props.colorOverlay : 'transparent'
}));

const textWidthStyle = computed(() => ({
  maxWidth: props.anchoTexto,
  width: '100%'
}));

const alturaImagenStyle = computed(() => ({
  minHeight: props.altura
}));

const tituloClasses = computed(() => [
  `text-${props.colorTitulo}`,
  'text-h3',
  'text-weight-bold',
  'q-mb-sm'
]);

const descripcionClasses = computed(() => [
  `text-${props.colorDescripcion}`,
  'text-body1',
  'text-weight-medium'
]);

const cardClasses = computed(() => ({
  'q-mb-xl': true,
  'hover-effect': props.efectoHover
}));
</script>

<style>
.info-section-component .info-card {
  transition: transform 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
}

.info-section-component .bg-overlay {
  background: rgba(0, 0, 0, 0.6) !important;
}

.info-section-component .text-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.info-section-component .text-centro {
  text-align: center;
}

.info-section-component .text-izquierda {
  text-align: left;
}

.info-section-component .text-derecha {
  text-align: right;
}

.info-section-component .text-container h2 {
  letter-spacing: 1px;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  width: 100%;
}

.info-section-component .text-container p {
  line-height: 1.6;
  max-width: 100%;
  font-size: 1rem;
}

.info-section-component .hover-effect:hover {
  transform: translateY(-5px);
}

.info-section-component .q-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .info-section-component .text-container h2 {
    font-size: 1.5rem;
  }
  
  .info-section-component .text-container p {
    font-size: 0.9rem;
  }
  
  .info-section-component .text-container {
    padding: 0.5rem;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .info-section-component .text-container h2 {
    font-size: 1.75rem;
  }
}
</style>
