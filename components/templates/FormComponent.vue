<template>
  <div class="form-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <h2 v-if="content.title" class="q-mt-md q-mb-lg">{{ content.title }}</h2>
      
      <q-form @submit.prevent="onSubmit" class="form-content">
        <div v-for="(field, index) in content.fields || []" :key="index" class="q-mb-md">
          <!-- Campo de texto -->
          <q-input 
            v-if="field.type === 'text'" 
            v-model="formData[field.name]" 
            :label="field.label" 
            :required="field.required" 
            outlined
          />
          
          <!-- Campo de email -->
          <q-input 
            v-else-if="field.type === 'email'" 
            v-model="formData[field.name]" 
            :label="field.label" 
            :required="field.required" 
            type="email" 
            outlined
          />
          
          <!-- Campo numérico -->
          <q-input 
            v-else-if="field.type === 'number'" 
            v-model="formData[field.name]" 
            :label="field.label" 
            :required="field.required" 
            type="number" 
            outlined
          />
          
          <!-- Área de texto -->
          <q-input 
            v-else-if="field.type === 'textarea'" 
            v-model="formData[field.name]" 
            :label="field.label" 
            :required="field.required" 
            type="textarea" 
            outlined
          />
          
          <!-- Selector -->
          <q-select 
            v-else-if="field.type === 'select'" 
            v-model="formData[field.name]" 
            :label="field.label" 
            :required="field.required" 
            :options="field.options || []" 
            outlined
          />
        </div>
        
        <div class="q-mt-lg">
          <q-btn 
            type="submit" 
            color="primary" 
            :label="content.submitText || 'Enviar'" 
            :disable="isPreview"
          />
        </div>
      </q-form>
      
      <!-- Mensaje de éxito -->
      <q-banner v-if="formSubmitted" class="bg-positive text-white q-mt-md">
        Formulario enviado correctamente. Gracias por contactarnos.
      </q-banner>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Formulario',
      fields: [
        { type: 'text', name: 'name', label: 'Nombre', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true }
      ],
      submitText: 'Enviar'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Crear un objeto reactivo para los datos del formulario
const formData = reactive({});
const formSubmitted = ref(false);

// Inicializar los campos del formulario
const initFormData = () => {
  if (props.content.fields) {
    props.content.fields.forEach(field => {
      formData[field.name] = '';
    });
  }
};

// Manejar el envío del formulario
const onSubmit = () => {
  // En un caso real, aquí enviaríamos los datos a un servidor
  console.log('Datos del formulario:', formData);
  
  // Mostrar mensaje de éxito
  formSubmitted.value = true;
  
  // Resetear el formulario después de un tiempo
  setTimeout(() => {
    formSubmitted.value = false;
    initFormData();
  }, 3000);
};

// Inicializar al montar el componente
initFormData();
</script>

<style scoped>
.form-component {
  padding: 3rem 0;
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

.form-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
