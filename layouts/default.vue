<template>
  <q-layout view="hHh LpR fff">
    <!-- Navbar/Header -->
    <NavbarComponent 
      :logoUrl="mockData.navbar.logoUrl" 
      :navItems="mockData.navbar.navItems" 
    />

    <!-- Contenido principal -->
    <q-page-container>
      <slot />
    </q-page-container>

    <!-- Footer -->
    <FooterContactComponent 
      :direccionTitle="mockData.footerContact.direccionTitle"
      :direccion="mockData.footerContact.direccion"
      :contactoTitle="mockData.footerContact.contactoTitle"
      :telefono="mockData.footerContact.telefono"
      :imagenUrl="mockData.footerContact.imagenUrl"
      :redesSociales="mockData.footerContact.redesSociales"
    />
  </q-layout>
</template>

<script setup>
import { mockData } from '~/data/mockData';
import NavbarComponent from '~/components/certiffy/NavbarComponent.vue';
import FooterContactComponent from '~/components/certiffy/FooterContactComponent.vue';
</script>

<style scoped>
/* Estructura básica para que el footer quede al final de la página */
.site-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el contenedor ocupe toda la altura de la ventana */
}

.page-content {
  flex: 1; /* Hace que el contenido principal ocupe todo el espacio disponible */
}
</style>
