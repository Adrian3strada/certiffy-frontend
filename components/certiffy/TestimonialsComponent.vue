<template>
  <section class="q-py-xl bg-blue-1">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="q-px-md q-pt-md q-pb-xl">
        <div class="row justify-center">
          <div class="col-12 col-md-10 col-lg-8">
            
            <!-- Carrusel de testimonios -->
            <q-card flat bordered class="shadow-1 bg-white q-pa-none">
              <q-carousel
                v-model="slide"
                swipeable
                animated
                arrows
                navigation
                infinite
                padding
                height="350px"
                control-color="primary"
                :autoplay="autoplay"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = 5000"
                class="rounded-borders"
              >
                <q-carousel-slide v-for="(testimonial, index) in testimonials" :key="index" :name="index" class="q-pa-lg flex flex-center">
                  <q-card flat class="bg-transparent text-center">
                    <q-card-section>
                      <div class="q-mb-md">
                        <q-icon name="format_quote" color="primary" size="3rem" />
                      </div>
                      
                      <div class="text-h5 q-mb-lg text-weight-medium text-dark">{{ testimonial.frase }}</div>
                      
                      <div class="q-mt-lg">
                        <div class="text-subtitle1 text-weight-bold">{{ testimonial.autor }}</div>
                        <div v-if="testimonial.organizacion" class="text-caption text-grey-8">{{ testimonial.organizacion }}</div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-carousel-slide>
              </q-carousel>
            </q-card>
            
            <div class="row justify-center q-mt-md">
              <div class="col-auto">
                <q-btn
                  round
                  flat
                  dense
                  color="primary"
                  icon="chevron_left"
                  @click="prevSlide"
                  class="q-mx-xs"
                />
                <q-btn
                  round
                  flat
                  dense
                  color="primary"
                  icon="chevron_right"
                  @click="nextSlide"
                  class="q-mx-xs"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  testimonials: {
    type: Array,
    default: () => [
      {
        frase: 'FRASE O TEXTO TESTIMONIAL',
        autor: 'nombre del testimonio',
        organizacion: 'organización perteneciente'
      },
      {
        frase: 'CERTIFFY ha transformado nuestra forma de gestionar la trazabilidad de nuestros productos',
        autor: 'Carlos Martínez',
        organizacion: 'Director de Calidad - AgroExport'
      },
      {
        frase: 'Desde que implementamos CERTIFFY, hemos reducido un 40% el tiempo dedicado a gestionar certificaciones',
        autor: 'Laura Gómez',
        organizacion: 'Gerente de Operaciones - FreshFruits'
      }
    ]
  }
});

const slide = ref(0);
const autoplay = ref(5000);

const nextSlide = () => {
  if (slide.value < props.testimonials.length - 1) {
    slide.value++;
  } else {
    slide.value = 0;
  }
};

const prevSlide = () => {
  if (slide.value > 0) {
    slide.value--;
  } else {
    slide.value = props.testimonials.length - 1;
  }
};
</script>