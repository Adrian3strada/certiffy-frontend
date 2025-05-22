<template>
  <q-card class="noticia-imagen-terciaria-card q-mb-md" flat bordered>
    <q-img
      :src="imagenUrl"
      :ratio="16/9"
      class="full-width"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-green-2">
          <q-icon name="image" size="3rem" color="white" />
        </div>
      </template>
    </q-img>
    <q-card-section v-if="caption" class="text-center text-caption text-grey-8">
      {{ caption }}
    </q-card-section>
  </q-card>
</template>

<script setup>
// Define props del componente
const props = defineProps({
  imagenUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: null
  }
});
</script>
