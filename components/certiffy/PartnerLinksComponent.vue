<template>
  <section class="q-py-xl bg-grey-1">
    <div class="q-mx-auto q-px-md" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold">{{ title }}</div>
      </div>
      
      <div class="row q-col-gutter-lg justify-center items-center">
        <div 
          v-for="(link, index) in links" 
          :key="index"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card 
            flat 
            bordered 
            class="q-pa-md text-center shadow-1 q-hoverable"
            style="transition: transform 0.3s ease, box-shadow 0.3s ease"
            :style="{ transform: 'translateY(0)' }"
            @mouseover="e => e.target.style.transform = 'translateY(-5px)'"
            @mouseleave="e => e.target.style.transform = 'translateY(0)'"
          >
            <q-card-section>
              <q-btn
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                flat
                no-caps
                color="primary"
                class="text-weight-medium text-subtitle1 full-width"
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
</script>