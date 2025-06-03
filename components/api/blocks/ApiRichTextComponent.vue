<template>
  <div class="q-my-xl q-mx-auto q-px-md" style="max-width: 800px; width: 100%; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; hyphens: auto;">
    <div v-if="content" class="text-body1" style="color: #333; line-height: 1.7;" v-html="processedContent"></div>
    <div v-else class="text-center q-pa-md text-grey-7">
      No hay contenido disponible
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

// Obtener el contenido HTML del bloque
const content = computed(() => {
  if (!props.block || !props.block.value) {
    return '';
  }
  
  // Si el valor es una cadena, asumimos que es HTML
  if (typeof props.block.value === 'string') {
    return props.block.value;
  }
  
  // Si el valor es un objeto, buscamos una propiedad que pueda contener HTML
  if (typeof props.block.value === 'object') {
    // Buscar en propiedades comunes donde podría estar el contenido
    const possibleContentProps = ['content', 'text', 'html', 'value'];
    
    for (const prop of possibleContentProps) {
      if (props.block.value[prop]) {
        return props.block.value[prop];
      }
    }
  }
  
  return '';
});

// Procesar el contenido para aplicar clases de Quasar a los elementos HTML
const processedContent = computed(() => {
  if (!content.value) return '';
  
  // Creamos un elemento temporal para manipular el HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content.value;
  
  // Aplicar estilos a los encabezados
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    heading.classList.add('text-certiffy-azul', 'text-weight-bold', 'q-mt-md', 'q-mb-sm');
    heading.style.maxWidth = '100%';
    heading.style.overflowWrap = 'break-word';
  });
  
  // Aplicar estilos a los párrafos
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.classList.add('q-mb-md');
    p.style.maxWidth = '100%';
    p.style.overflowWrap = 'break-word';
  });
  
  // Aplicar estilos a las listas
  const lists = tempDiv.querySelectorAll('ul, ol');
  lists.forEach(list => {
    list.classList.add('q-ml-lg', 'q-mb-lg');
  });
  
  // Aplicar estilos a los enlaces
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    link.classList.add('text-primary', 'q-transition');
    link.classList.add('q-hoverable');
    link.style.textDecoration = 'none';
  });
  
  // Aplicar estilos a las imágenes
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    img.classList.add('q-mb-md', 'q-mt-sm');
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
  });
  
  return tempDiv.innerHTML;
});
</script>
