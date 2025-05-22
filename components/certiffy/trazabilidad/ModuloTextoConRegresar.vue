<template>
  <q-card flat bordered class="q-pa-lg bg-purple-1 q-mb-xl">
    <div class="text-h4 text-bold q-mb-md">(TEXTO #3)</div>
    <div class="text-body1 q-mb-xl">{{ texto }}</div>
    
    <div class="row justify-end">
      <q-btn 
        color="grey-4" 
        text-color="black" 
        class="q-px-md" 
        @click="$emit('regresar')"
        unelevated
      >REGRESAR</q-btn>
    </div>
  </q-card>
</template>

<script setup>
const props = defineProps({
  texto: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.q-btn {
  font-weight: bold;
}
</style>
