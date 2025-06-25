<template>
  <section>
    <h2 class="noticias-title">{{ block.value.titulo_apartado || 'Noticias' }}</h2>
    <div class="noticias-grid">
      <div v-for="(noticia, idx) in block.value.noticias" :key="idx" class="noticia-card">
        <div class="noticia-img-wrapper">
          <img :src="getImageUrl(noticia.imagen)" :alt="noticia.imagen?.title || 'Imagen noticia'" class="noticia-img" />
        </div>
        <div class="noticia-info">
          <div class="noticia-meta">
            <span class="noticia-categoria">{{ noticia.categoria }}</span>
            <span class="noticia-fecha">{{ formatDate(noticia.fecha) }}</span>
          </div>
          <div class="noticia-desc" v-html="noticia.descripcion"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  block: { type: Object, required: true }
})

function getImageUrl(imagen) {
  if (!imagen) return '/assets/images/image-placeholder.svg';
  if (typeof imagen === 'string') return imagen;
  if (imagen.url) return imagen.url;
  return '/assets/images/image-placeholder.svg';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' });
}
</script>

<style scoped>
.noticias-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: bold;
}
.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  justify-items: center;
}
.noticia-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  min-height: 350px;
}
.noticia-img-wrapper {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f3f3f3;
}
.noticia-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.noticia-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.noticia-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #1976d2;
  margin-bottom: 0.5rem;
}
.noticia-categoria {
  font-weight: 600;
  text-transform: uppercase;
}
.noticia-fecha {
  color: #888;
}
.noticia-desc {
  color: #222;
  font-size: 1rem;
  margin-top: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style> 