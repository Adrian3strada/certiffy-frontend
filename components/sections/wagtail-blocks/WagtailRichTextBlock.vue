<template>
  <div class="wagtail-richtext-block" v-html="content"></div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Extraer el contenido del bloque
const content = computed(() => {
  if (!props.data) return '';
  return props.data.value || '';
});
</script>

<style scoped>
.wagtail-richtext-block {
  margin: 1rem 0;
  line-height: 1.6;
}

.wagtail-richtext-block :deep(p) {
  margin-bottom: 1rem;
}

.wagtail-richtext-block :deep(h1),
.wagtail-richtext-block :deep(h2),
.wagtail-richtext-block :deep(h3),
.wagtail-richtext-block :deep(h4),
.wagtail-richtext-block :deep(h5),
.wagtail-richtext-block :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.wagtail-richtext-block :deep(ul),
.wagtail-richtext-block :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.wagtail-richtext-block :deep(li) {
  margin-bottom: 0.5rem;
}

.wagtail-richtext-block :deep(a) {
  color: #1976d2;
  text-decoration: none;
}

.wagtail-richtext-block :deep(a:hover) {
  text-decoration: underline;
}

.wagtail-richtext-block :deep(blockquote) {
  border-left: 4px solid #e0e0e0;
  padding-left: 1rem;
  margin-left: 0;
  color: #616161;
}

.wagtail-richtext-block :deep(pre) {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.wagtail-richtext-block :deep(code) {
  background-color: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>
