<template>
  <q-card class="full-width q-mb-xl" flat bordered style="border-color: #8e24aa">
    <q-img 
      src="https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
      height="300px"
    >
      <div class="absolute-center text-center full-width">
        <div class="text-h1 text-bold text-white" style="text-decoration: underline; text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">TRAZABILIDAD</div>
      </div>
    </q-img>
  </q-card>
</template>

<script setup>
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  }
})

const bannerStyle = {
  backgroundImage: `url('${props.imagenUrl}')`
}
</script>

<style scoped>
.q-banner {
  display: flex;
  align-items: end;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.text-h4 {
  text-shadow: 0 1px 6px rgba(0,0,0,0.18);
}
</style>
