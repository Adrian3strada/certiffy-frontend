<template>
  <div class="testimonials-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <h2 v-if="content.title" class="q-mt-md q-mb-lg text-center">{{ content.title }}</h2>
      
      <div class="row q-col-gutter-lg">
        <div 
          v-for="(item, index) in content.items || []" 
          :key="index" 
          class="col-12 col-md-6"
        >
          <q-card class="testimonial-card">
            <q-card-section>
              <div class="row items-center">
                <div class="col-auto q-mr-md">
                  <q-avatar size="60px">
                    <img v-if="item.avatar" :src="item.avatar" :alt="item.name">
                    <q-icon v-else name="mdi-account" size="40px" color="grey-7" />
                  </q-avatar>
                </div>
                <div class="col">
                  <h5 class="q-my-none">{{ item.name }}</h5>
                  <p class="text-caption q-mt-sm q-mb-none">{{ item.position }}</p>
                </div>
              </div>
            </q-card-section>
            
            <q-card-section>
              <p class="testimonial-text">{{ item.text }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Lo que dicen nuestros clientes',
      items: [
        { name: 'Cliente 1', position: 'CEO', text: 'Testimonio 1', avatar: null },
        { name: 'Cliente 2', position: 'Director', text: 'Testimonio 2', avatar: null }
      ]
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.testimonials-component {
  padding: 3rem 0;
  background-color: #f9f9f9;
}

.preview-mode {
  cursor: default;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.testimonial-card {
  height: 100%;
  border-left: 4px solid #1976D2;
}

.testimonial-text {
  font-style: italic;
  position: relative;
  padding: 0 20px;
}

.testimonial-text::before {
  content: '"';
  font-size: 2rem;
  color: #1976D2;
  position: absolute;
  left: 0;
  top: -10px;
}

.testimonial-text::after {
  content: '"';
  font-size: 2rem;
  color: #1976D2;
  position: absolute;
  right: 0;
  bottom: -20px;
}
</style>
