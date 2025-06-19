<template>
  <q-card class="event-card q-mb-md" flat bordered>
    <q-card-section class="bg-primary text-white">
      <div class="text-h6 ellipsis-2-lines">{{ event.title }}</div>
      <div class="text-subtitle2">{{ formattedDate }}</div>
    </q-card-section>

    <q-card-section>
      <div class="row items-center q-gutter-sm">
        <q-chip
          v-if="event.categoria"
          color="accent"
          text-color="white"
          icon="category"
          clickable
          @click="$emit('filter-category', event.categoria)"
        >
          {{ getCategoryName(event.categoria) }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-section v-if="event.tags && event.tags.length > 0" class="q-pt-none">
      <div class="row items-center q-gutter-xs">
        <q-chip
          v-for="tag in event.tags"
          :key="tag"
          outline
          color="primary"
          size="sm"
          clickable
          @click="$emit('filter-tag', tag)"
        >
          {{ tag }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        color="primary"
        :to="normalizeUrl(event.url)"
        label="Ver detalles"
        icon="arrow_forward"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Event, EventCategory } from '~/composables/useEvents';

const props = defineProps<{
  event: Event;
  categories: EventCategory[];
}>();

const emit = defineEmits<{
  (e: 'filter-category', category: string): void;
  (e: 'filter-tag', tag: string): void;
}>();

// Formatear la fecha del evento
const formattedDate = computed(() => {
  try {
    const date = new Date(props.event.date);
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    console.error('Error al formatear fecha:', e);
    return props.event.date;
  }
});

// Obtener el nombre de la categoría a partir del slug
const getCategoryName = (categorySlug: string) => {
  const category = props.categories.find(cat => cat.slug === categorySlug);
  return category ? category.nombre : categorySlug;
};

// Normalizar URL para links
const normalizeUrl = (url: string) => {
  if (!url) return '/';
  // Si la URL ya es absoluta, devolverla tal cual
  if (url.startsWith('http')) return url;
  // Si la URL comienza con /, es una ruta interna
  return url;
};
</script>

<style scoped>
.event-card {
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
