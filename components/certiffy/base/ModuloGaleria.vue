<template>
  <ModuloBase
    :tamanio="tamanio"
    :espaciado="espaciado"
    :ancho-completo="anchoCompleto"
    :borde="borde"
    :efecto-elevacion="false"
    :card-clase="cardClase"
  >
    <q-card-section>
      <div class="text-center q-mb-lg">
        <div v-if="titulo" class="text-h4 text-weight-bold q-mb-md">{{ titulo }}</div>
        <div v-if="descripcion" class="text-body1 q-mx-auto" style="max-width: 800px">{{ descripcion }}</div>
      </div>
      
      <div 
        class="row q-col-gutter-md"
        :class="[
          itemsClase
        ]"
      >
        <template v-if="tipoGaleria === 'imagenes'">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            :class="[columnaClase]"
          >
            <q-card
              :class="{ 'certiffy-galeria-item-hover': efectoElevacionItems }"
              :flat="!bordeItems"
              :bordered="bordeItems"
            >
              <q-img
                :src="item.url || item.imagenUrl"
                :ratio="mediaRatio"
                spinner-color="primary"
                spinner-size="42px"
                :height="alturaElementos"
                :fit="ajusteMedia"
                class="rounded-borders"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center text-negative">
                    <q-icon name="error" size="2rem" />
                  </div>
                </template>
                <div 
                  v-if="item.titulo" 
                  class="absolute-bottom text-center"
                  style="background: rgba(0,0,0,0.4)"
                >
                  <div class="text-subtitle1 text-bold text-white q-py-sm">{{ item.titulo }}</div>
                </div>
              </q-img>
              
              <q-card-section v-if="item.descripcion">
                <div class="text-subtitle2">{{ item.descripcion }}</div>
              </q-card-section>
              
              <q-card-actions v-if="item.accion" align="center">
                <q-btn flat color="primary" :label="item.accion" :to="item.ruta || '#'" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
        
        <template v-else-if="tipoGaleria === 'documentos'">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            :class="[columnaClase]"
          >
            <q-card
              :class="{ 'certiffy-galeria-item-hover': efectoElevacionItems }"
              :flat="!bordeItems"
              :bordered="bordeItems"
              class="text-center"
            >
              <q-card-section>
                <q-icon :name="item.icono || 'description'" size="60px" color="grey-7" />
              </q-card-section>
              
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">{{ item.titulo }}</div>
                <div v-if="item.descripcion" class="text-caption q-mt-sm">{{ item.descripcion }}</div>
              </q-card-section>
              
              <q-card-actions vertical align="center">
                <q-btn flat color="primary" :label="item.accion || 'Ver documento'" :to="item.url || '#'" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
        
        <template v-else>
          <slot name="items-personalizados" :items="items"></slot>
        </template>
      </div>
      
      <div v-if="mostrarVerMas" class="text-center q-mt-xl">
        <q-btn 
          :label="textoVerMas" 
          :color="colorVerMas"
          :to="rutaVerMas"
          :outline="outlineVerMas"
        />
      </div>
    </q-card-section>
  </ModuloBase>
</template>

<script setup>
import { computed } from 'vue';
import ModuloBase from './ModuloBase.vue';

const props = defineProps({
  // Props del módulo base
  tamanio: { type: String, default: 'lg' },
  espaciado: { type: String, default: 'normal' },
  anchoCompleto: { type: Boolean, default: false },
  borde: { type: Boolean, default: true },
  cardClase: { type: String, default: '' },
  
  // Contenido de encabezado
  titulo: { type: String, default: '' },
  descripcion: { type: String, default: '' },
  
  // Datos de la galería
  items: { 
    type: Array, 
    default: () => []
  },
  tipoGaleria: { 
    type: String, 
    default: 'imagenes',
    validator: (value) => ['imagenes', 'documentos', 'personalizado'].includes(value)
  },
  
  // Configuración de items
  columnasDesktop: { 
    type: Number, 
    default: 3,
    validator: (value) => [1, 2, 3, 4, 6].includes(value)
  },
  columnasTablet: { 
    type: Number, 
    default: 2,
    validator: (value) => [1, 2, 3].includes(value)
  },
  columnasMobile: { 
    type: Number, 
    default: 1,
    validator: (value) => [1, 2].includes(value)
  },
  
  // Apariencia de items
  alturaElementos: { type: String, default: '200px' },
  bordeItems: { type: Boolean, default: true },
  efectoElevacionItems: { type: Boolean, default: true },
  ajusteMedia: { 
    type: String, 
    default: 'cover',
    validator: (value) => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
  },
  mediaRatio: { type: Number, default: 1 },
  
  // Ver más
  mostrarVerMas: { type: Boolean, default: false },
  textoVerMas: { type: String, default: 'Ver más' },
  rutaVerMas: { type: [String, Object], default: '#' },
  colorVerMas: { type: String, default: 'primary' },
  outlineVerMas: { type: Boolean, default: false }
});

// Calcular clases para columnas según configuración
const columnaClase = computed(() => {
  const colDesktop = 12 / props.columnasDesktop;
  const colTablet = 12 / props.columnasTablet;
  const colMobile = 12 / props.columnasMobile;
  
  return `col-${colMobile} col-sm-${colTablet} col-md-${colDesktop}`;
});

// Clases de alineación para items
const itemsClase = computed(() => {
  return props.items.length > 1 ? 'justify-center' : 'justify-center';
});
</script>

<style scoped>
.certiffy-galeria-item-hover {
  transition: all 0.3s ease;
}

.certiffy-galeria-item-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
</style>
