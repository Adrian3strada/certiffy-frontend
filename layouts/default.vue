<template>
  <q-layout view="lHh Lpr lFf"> <!-- Cambiado a lFf para que footer tenga posición fija -->
    <q-header elevated class="bg-primary" style="z-index:10">
      <ApiNavbarComponent />
    </q-header>
    
    <q-page-container>
      <q-page class="q-pa-none full-width q-mx-none q-px-none">
        <div class="content-wrapper">
          <slot />
        </div>
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

/* Asegura que el contenido ocupe al menos el espacio disponible en la ventana menos el footer */
.content-wrapper {
  min-height: calc(100vh - 240px); /* Ajustar este valor según la altura del footer */
}

/* Estilo para la página completa */
.q-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>