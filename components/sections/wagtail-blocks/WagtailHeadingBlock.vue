<template>
  <div class="wagtail-heading-block">
    <component 
      :is="`h${level}`" 
      :id="headingId"
      class="heading"
    >
      {{ text }}
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Extraer datos del bloque
const text = computed(() => {
  if (!props.data) return '';
  return props.data.value?.text || '';
});

const level = computed(() => {
  if (!props.data || !props.data.value) return 2;
  return props.data.value.level || 2;
});

const headingId = computed(() => {
  if (!props.data || !props.data.value) return '';
  return props.data.value.id || '';
});
</script>

<style scoped>
.wagtail-heading-block {
  margin: 1rem 0;
}

.heading {
  font-family: inherit;
  line-height: 1.2;
}
</style>
