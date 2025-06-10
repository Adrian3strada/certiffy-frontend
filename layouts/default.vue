<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-primary" style="z-index:10">
      <ApiNavbarComponent />
    </q-header>
    
    <q-page-container>
      <q-page class="q-pa-none full-width q-mx-none q-px-none">
        <slot />
        <ApiFooterComponent />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ApiNavbarComponent from '~/components/api/layout/ApiNavbarComponent.vue';
import ApiFooterComponent from '~/components/api/layout/ApiFooterComponent.vue';
</script>

<style scoped>
/* Solo si realmente necesitas ocultar scrollbars visibles */
.no-scrollbar {
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>