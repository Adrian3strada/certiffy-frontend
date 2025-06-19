<template>
  <div class="event-filter-block q-py-lg">
    <EventFilterComponent
      :title="block.value.title"
      :show-categories="block.value.show_categories"
      :show-tags="block.value.show_tags"
      :items-per-page="block.value.items_per_page"
    />
  </div>
</template>

<script setup lang="ts">
import EventFilterComponent from '~/components/api/events/EventFilterComponent.vue';

// Definición de las props
const props = defineProps({
  block: {
    type: Object,
    required: true,
    default: () => ({
      value: {
        title: 'Eventos',
        show_categories: true,
        show_tags: true,
        items_per_page: 6
      }
    })
  }
});
</script>

<style scoped>
.event-filter-block {
  width: 100%;
}
</style>
