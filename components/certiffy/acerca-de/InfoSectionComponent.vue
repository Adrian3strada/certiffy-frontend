<template>
  <section class="q-pa-xl">
    <div class="q-mx-auto" style="max-width: 1200px;">
      <div class="row justify-center q-col-gutter-lg q-px-md">
        
        <!-- Para texto a la izquierda -->
        <template v-if="posicionTexto === 'izquierda'">
          <div class="col-12 col-md-7 flex flex-center">
            <q-card class="full-width q-my-sm overflow-hidden rounded-borders" style="height: 400px;" bordered flat>
              <q-img 
                :src="imagenFondo" 
                class="absolute-full" 
                fit="cover"
                @error="handleImageError"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-green-2">
                    <q-icon name="image" size="3rem" color="white" />
                  </div>
                </template>
                <div class="absolute-full" style="background-color: rgba(0, 0, 0, 0.5);">
                  <q-card-section class="q-pa-lg" style="height: 100%;">
                    <div 
                      :class="[
                        'text-h4 text-weight-bold text-white q-mb-md text-shadow-1',
                        {'text-left': alineacionTexto === 'izquierda'},
                        {'text-right': alineacionTexto === 'derecha'},
                        {'text-center': alineacionTexto === 'centro'}
                      ]"
                    >{{ titulo }}</div>
                    <div 
                      :class="[
                        'text-body1 text-white text-shadow-1',
                        {'text-left': alineacionTexto === 'izquierda'},
                        {'text-right': alineacionTexto === 'derecha'},
                        {'text-center': alineacionTexto === 'centro'}
                      ]"
                    >{{ descripcion }}</div>
                  </q-card-section>
                </div>
              </q-img>
            </q-card>
          </div>
        </template>
        
        <!-- Para texto a la derecha -->
        <template v-else-if="posicionTexto === 'derecha'">
          <div class="col-12 col-md-7 flex flex-center">
            <q-card class="full-width q-my-sm overflow-hidden rounded-borders" style="height: 400px;" bordered flat>
              <q-img 
                :src="imagenFondo" 
                class="absolute-full" 
                fit="cover"
                @error="handleImageError"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-green-2">
                    <q-icon name="image" size="3rem" color="white" />
                  </div>
                </template>
                <div class="absolute-full" style="background-color: rgba(0, 0, 0, 0.5);">
                  <q-card-section class="q-pa-lg" style="height: 100%;">
                    <div 
                      :class="[
                        'text-h4 text-weight-bold text-white q-mb-md text-shadow-1',
                        {'text-left': alineacionTexto === 'izquierda'},
                        {'text-right': alineacionTexto === 'derecha'},
                        {'text-center': alineacionTexto === 'centro'}
                      ]"
                    >{{ titulo }}</div>
                    <div 
                      :class="[
                        'text-body1 text-white text-shadow-1',
                        {'text-left': alineacionTexto === 'izquierda'},
                        {'text-right': alineacionTexto === 'derecha'},
                        {'text-center': alineacionTexto === 'centro'}
                      ]"
                    >{{ descripcion }}</div>
                  </q-card-section>
                </div>
              </q-img>
            </q-card>
          </div>
        </template>
        
        <!-- Para texto centrado con marco e imagen de fondo -->
        <template v-else-if="posicionTexto === 'centro-enmarcado'">
          <div class="col-12 col-md-7 flex flex-center">
            <q-card class="full-width q-my-sm overflow-hidden rounded-borders" style="height: 400px;" bordered flat>
              <q-img 
                :src="imagenFondo" 
                class="absolute-full" 
                fit="cover"
                @error="handleImageError"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-green-2">
                    <q-icon name="image" size="3rem" color="white" />
                  </div>
                </template>
                <div class="absolute-full" style="background-color: rgba(0, 0, 0, 0.5);">
                  <q-card-section class="q-pa-lg" style="height: 100%;">
                    <div 
                      class="text-h4 text-weight-bold text-white q-mb-md text-shadow-1 text-center"
                    >{{ titulo }}</div>
                    <div 
                      class="text-body1 text-white text-shadow-1 text-center"
                    >{{ descripcion }}</div>
                  </q-card-section>
                </div>
              </q-img>
            </q-card>
          </div>
        </template>
        
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

// Define props del componente
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  imagenFondo: {
    type: String,
    default: '/images/landscapes/hills-light.jpg'
  },
  posicionTexto: {
    type: String,
    default: 'derecha', // Opciones: 'izquierda', 'derecha', 'centro-enmarcado'
    validator: (value) => ['izquierda', 'derecha', 'centro-enmarcado'].includes(value)
  },
  alineacionTexto: {
    type: String,
    default: 'izquierda', // Opciones: 'izquierda', 'derecha', 'centro'
    validator: (value) => ['izquierda', 'derecha', 'centro'].includes(value)
  }
});

// Variable reactiva para controlar si se muestra la imagen o el fondo alternativo
const showImage = ref(true);

// Función para manejar errores de carga de imagen
const handleImageError = () => {
  console.warn('Error al cargar la imagen de fondo. Usando color de fondo alternativo.');
  showImage.value = false;
};
</script>
