<template>
  <section class="partner-links-component q-py-xl bg-grey-1">
    <div class="q-mx-auto q-px-md" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="component-title text-h4 text-weight-bold">{{ title }}</div>
      </div>
      
      <div class="row q-col-gutter-md q-col-gutter-lg-lg justify-center items-center">
        <div 
          v-for="(link, index) in links" 
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-lg-3 q-mb-sm"
        >
          <q-card 
            flat 
            bordered 
            class="partner-card q-pa-md text-center shadow-1 q-hoverable"
            :class="{ 'partner-card-active': activeCard === index }"
            @mouseover="activeCard = index"
            @mouseleave="activeCard = null"
          >
            <q-card-section>
              <q-btn
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                flat
                no-caps
                color="primary"
                class="partner-link text-weight-medium text-subtitle1 full-width"
                :label="link.text"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  links: {
    type: Array,
    required: true
  }
});

const activeCard = ref(null);
</script>

<style scoped>
.partner-links-component .partner-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.partner-links-component .partner-card-active {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.partner-links-component .partner-link {
  transition: color 0.2s ease;
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .partner-links-component .component-title {
    font-size: 1.5rem !important;
    margin-bottom: 1.5rem !important;
  }
  
  .partner-links-component .partner-card {
    padding: 8px !important;
  }
  
  .partner-links-component .partner-link {
    font-size: 0.9rem !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .partner-links-component .component-title {
    font-size: 1.75rem !important;
  }
  
  .partner-links-component .partner-link {
    font-size: 1rem !important;
  }
}
</style>