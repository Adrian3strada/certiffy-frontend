<template>
  <div class="q-my-xl q-mx-auto" style="max-width: 800px; width: 100%;" :class="alignment">
    <q-btn
      v-if="buttonText"
      :color="buttonColor"
      :label="buttonText"
      :to="isInternalLink ? buttonUrl : undefined"
      :href="isInternalLink ? undefined : buttonUrl"
      :target="isInternalLink ? undefined : '_blank'"
      :rel="isInternalLink ? undefined : 'noopener noreferrer'"
      class="certiffy-btn certiffy-btn-lg certiffy-text"
      no-caps
      rounded
      unelevated
      padding="md lg"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  alignment: {
    type: String,
    default: 'text-center',
    validator: (value) => ['text-left', 'text-center', 'text-right'].includes(value)
  }
});

// Extraer datos del botón
const buttonData = computed(() => {
  if (!props.block || !props.block.value) {
    return { text: '', url: '', style: 'primary' };
  }
  
  return {
    text: props.block.value.text || '',
    url: props.block.value.url || '',
    style: props.block.value.style || 'primary'
  };
});

// Texto del botón
const buttonText = computed(() => buttonData.value.text);

// URL del botón
const buttonUrl = computed(() => {
  const url = buttonData.value.url || '';
  
  // Si la URL comienza con http:// o https://, es un enlace externo
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Reemplazar la URL de desarrollo de Wagtail con la ruta de frontend
  // Ejemplo: http://127.0.0.1:8000/plataforma/trazabilidad/ -> /plataforma/trazabilidad
  if (url.includes('127.0.0.1:8000') || url.includes('localhost:8000')) {
    return url.replace(/https?:\/\/(127\.0\.0\.1|localhost):8000/, '').replace(/\/$/, '');
  }
  
  return url;
});

// Determinar si el enlace es interno o externo
const isInternalLink = computed(() => {
  const url = buttonData.value.url || '';
  return !(url.startsWith('http://') || url.startsWith('https://'));
});

// Color del botón según el estilo
const buttonColor = computed(() => {
  const styleMap = {
    'primary': 'primary',
    'secondary': 'secondary',
    'success': 'positive',
    'danger': 'negative',
    'warning': 'warning',
    'info': 'info',
    'light': 'grey-3',
    'dark': 'dark'
  };
  
  return styleMap[buttonData.value.style] || 'primary';
});



// Manejar el clic en el botón
const handleClick = (event) => {
  // Si es un enlace interno, usar el router de Vue
  if (isInternalLink.value && buttonUrl.value) {
    event.preventDefault();
    router.push(buttonUrl.value);
  }
};
</script>


