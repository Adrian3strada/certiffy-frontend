<template>
  <div 
    class="certiffy-modulo q-pa-md" 
    :class="[
      `certiffy-modulo--${tamanio}`,
      espaciadoClase,
      bordeClase,
      { 'certiffy-modulo--fullwidth': anchoCompleto }
    ]"
  >
    <q-card
      flat
      :bordered="borde"
      :class="[
        cardClase,
        { 'certiffy-card-hover': efectoElevacion }
      ]"
    >
      <slot></slot>
    </q-card>
  </div>
</template>

<script setup>
const props = defineProps({
  // Espaciado y tamaño
  tamanio: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  espaciado: {
    type: String,
    default: 'normal',
    validator: (value) => ['compacto', 'normal', 'amplio'].includes(value)
  },
  anchoCompleto: {
    type: Boolean,
    default: false
  },
  
  // Apariencia
  borde: {
    type: Boolean,
    default: true
  },
  cardClase: {
    type: String,
    default: ''
  },
  efectoElevacion: {
    type: Boolean,
    default: false
  }
});

// Clases computadas para espaciado
const espaciadoClase = computed(() => {
  const mapa = {
    'compacto': 'q-pa-sm',
    'normal': 'q-pa-md',
    'amplio': 'q-pa-lg'
  };
  return mapa[props.espaciado] || mapa.normal;
});

// Clases computadas para bordes
const bordeClase = computed(() => {
  return props.borde ? 'certiffy-modulo--bordered' : '';
});
</script>

<style scoped>
.certiffy-modulo {
  margin-bottom: 1.5rem;
}

.certiffy-modulo--sm {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.certiffy-modulo--md {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.certiffy-modulo--lg {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.certiffy-modulo--xl {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.certiffy-modulo--fullwidth {
  width: 100%;
}

.certiffy-modulo--bordered {
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 4px;
}

.certiffy-modulo--elevated {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}

.certiffy-card-hover {
  transition: all 0.3s ease;
}

.certiffy-card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.certiffy-card-hover .q-btn {
  transition: transform 0.3s ease;
}

.certiffy-card-hover:hover .q-btn {
  transform: translateY(0);
}
</style>
