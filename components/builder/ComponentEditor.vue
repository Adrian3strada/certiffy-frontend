<template>
  <div class="component-editor q-pa-md">
    <h5 class="q-mt-none q-mb-md">Editar {{ componentTitle }}</h5>
    
    <q-form @submit.prevent="saveChanges">
      <!-- Campos dinámicos según el tipo de componente -->
      <div v-if="componentType === 'header'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        <q-input v-model="formData.subtitle" label="Subtítulo" class="q-mb-md" />
        <q-file v-model="formData.logo" label="Logo" accept="image/*" class="q-mb-md">
          <template v-slot:prepend>
            <q-icon name="mdi-image" />
          </template>
        </q-file>
        
        <p class="text-subtitle2 q-mb-sm">Elementos del Menú</p>
        <div v-for="(item, index) in formData.menuItems || []" :key="index" class="row q-col-gutter-sm q-mb-sm">
          <div class="col-5">
            <q-input v-model="item.text" label="Texto" dense />
          </div>
          <div class="col-5">
            <q-input v-model="item.url" label="URL" dense />
          </div>
          <div class="col-2 flex items-center">
            <q-btn round flat icon="mdi-delete" size="sm" @click="removeMenuItem(index)" />
          </div>
        </div>
        <q-btn label="Añadir elemento" icon="mdi-plus" flat @click="addMenuItem" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'hero'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        <q-input v-model="formData.subtitle" label="Subtítulo" class="q-mb-md" />
        <q-file v-model="formData.backgroundImage" label="Imagen de Fondo" accept="image/*" class="q-mb-md">
          <template v-slot:prepend>
            <q-icon name="mdi-image" />
          </template>
        </q-file>
        <q-input v-model="formData.buttonText" label="Texto del Botón" class="q-mb-md" />
        <q-input v-model="formData.buttonUrl" label="URL del Botón" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'content'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        <q-editor v-model="formData.text" min-height="200px" class="q-mb-md" />
        <q-file v-model="formData.image" label="Imagen" accept="image/*" class="q-mb-md">
          <template v-slot:prepend>
            <q-icon name="mdi-image" />
          </template>
        </q-file>
        <q-select v-model="formData.imagePosition" :options="['left', 'right', 'top', 'bottom']" label="Posición de la Imagen" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'gallery'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        
        <p class="text-subtitle2 q-mb-sm">Imágenes</p>
        <div v-for="(image, index) in formData.images || []" :key="index" class="row q-col-gutter-sm q-mb-sm">
          <div class="col-10">
            <q-input v-model="image.url" label="URL de la Imagen" dense />
          </div>
          <div class="col-2 flex items-center">
            <q-btn round flat icon="mdi-delete" size="sm" @click="removeImage(index)" />
          </div>
        </div>
        <q-btn label="Añadir imagen" icon="mdi-plus" flat @click="addImage" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'features'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        
        <p class="text-subtitle2 q-mb-sm">Características</p>
        <div v-for="(feature, index) in formData.items || []" :key="index" class="q-mb-md">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-10">
              <q-input v-model="feature.title" label="Título" dense class="q-mb-sm" />
            </div>
            <div class="col-2 flex items-center">
              <q-btn round flat icon="mdi-delete" size="sm" @click="removeFeature(index)" />
            </div>
          </div>
          <q-input v-model="feature.description" label="Descripción" dense class="q-mb-sm" />
          <q-input v-model="feature.icon" label="Icono (ej: mdi-check)" dense />
        </div>
        <q-btn label="Añadir característica" icon="mdi-plus" flat @click="addFeature" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'testimonials'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        
        <p class="text-subtitle2 q-mb-sm">Testimonios</p>
        <div v-for="(testimonial, index) in formData.items || []" :key="index" class="q-mb-md">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-10">
              <q-input v-model="testimonial.name" label="Nombre" dense class="q-mb-sm" />
            </div>
            <div class="col-2 flex items-center">
              <q-btn round flat icon="mdi-delete" size="sm" @click="removeTestimonial(index)" />
            </div>
          </div>
          <q-input v-model="testimonial.position" label="Cargo" dense class="q-mb-sm" />
          <q-input v-model="testimonial.text" label="Testimonio" dense class="q-mb-sm" type="textarea" />
          <q-file v-model="testimonial.avatar" label="Avatar" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="mdi-account" />
            </template>
          </q-file>
        </div>
        <q-btn label="Añadir testimonio" icon="mdi-plus" flat @click="addTestimonial" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'cta'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        <q-input v-model="formData.text" label="Texto" class="q-mb-md" />
        <q-input v-model="formData.buttonText" label="Texto del Botón" class="q-mb-md" />
        <q-input v-model="formData.buttonUrl" label="URL del Botón" class="q-mb-md" />
        <q-color v-model="formData.backgroundColor" label="Color de Fondo" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'form'">
        <q-input v-model="formData.title" label="Título" class="q-mb-md" />
        
        <p class="text-subtitle2 q-mb-sm">Campos del Formulario</p>
        <div v-for="(field, index) in formData.fields || []" :key="index" class="q-mb-md">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-5">
              <q-input v-model="field.label" label="Etiqueta" dense />
            </div>
            <div class="col-5">
              <q-select v-model="field.type" :options="['text', 'email', 'number', 'textarea', 'select']" label="Tipo" dense />
            </div>
            <div class="col-2 flex items-center">
              <q-btn round flat icon="mdi-delete" size="sm" @click="removeField(index)" />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="field.name" label="Nombre del Campo" dense />
            </div>
            <div class="col-6">
              <q-checkbox v-model="field.required" label="Obligatorio" />
            </div>
          </div>
        </div>
        <q-btn label="Añadir campo" icon="mdi-plus" flat @click="addField" class="q-mb-md" />
        
        <q-input v-model="formData.submitText" label="Texto del Botón de Envío" class="q-mb-md" />
      </div>
      
      <div v-else-if="componentType === 'footer'">
        <q-input v-model="formData.copyright" label="Copyright" class="q-mb-md" />
        
        <p class="text-subtitle2 q-mb-sm">Enlaces</p>
        <div v-for="(link, index) in formData.links || []" :key="index" class="row q-col-gutter-sm q-mb-sm">
          <div class="col-5">
            <q-input v-model="link.text" label="Texto" dense />
          </div>
          <div class="col-5">
            <q-input v-model="link.url" label="URL" dense />
          </div>
          <div class="col-2 flex items-center">
            <q-btn round flat icon="mdi-delete" size="sm" @click="removeLink(index)" />
          </div>
        </div>
        <q-btn label="Añadir enlace" icon="mdi-plus" flat @click="addLink" class="q-mb-md" />
        
        <p class="text-subtitle2 q-mb-sm">Redes Sociales</p>
        <div v-for="(social, index) in formData.socialMedia || []" :key="index" class="row q-col-gutter-sm q-mb-sm">
          <div class="col-5">
            <q-input v-model="social.icon" label="Icono" dense />
          </div>
          <div class="col-5">
            <q-input v-model="social.url" label="URL" dense />
          </div>
          <div class="col-2 flex items-center">
            <q-btn round flat icon="mdi-delete" size="sm" @click="removeSocial(index)" />
          </div>
        </div>
        <q-btn label="Añadir red social" icon="mdi-plus" flat @click="addSocial" class="q-mb-md" />
      </div>
      
      <div v-else>
        <p class="text-italic">Editor no disponible para este tipo de componente.</p>
      </div>
      
      <div class="row justify-end q-mt-lg">
        <q-btn label="Cancelar" flat @click="cancel" class="q-mr-sm" />
        <q-btn label="Guardar" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  componentType: {
    type: String,
    required: true
  },
  componentContent: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:content']);

// Título del componente según su tipo
const componentTitle = computed(() => {
  const titles = {
    'header': 'Encabezado',
    'hero': 'Banner Principal',
    'content': 'Bloque de Contenido',
    'gallery': 'Galería de Imágenes',
    'features': 'Características',
    'testimonials': 'Testimonios',
    'cta': 'Llamada a la Acción',
    'form': 'Formulario',
    'footer': 'Pie de Página'
  };
  
  return titles[props.componentType] || props.componentType;
});

// Datos del formulario
const formData = ref({...props.componentContent});

// Observar cambios en las props para actualizar el formulario
watch(() => props.componentContent, (newContent) => {
  formData.value = {...newContent};
}, { deep: true });

// Guardar cambios
const saveChanges = () => {
  emit('update:content', {...formData.value});
};

// Cancelar edición
const cancel = () => {
  formData.value = {...props.componentContent};
};

// Funciones para manipular arrays en los formularios
const addMenuItem = () => {
  if (!formData.value.menuItems) {
    formData.value.menuItems = [];
  }
  formData.value.menuItems.push({ text: '', url: '' });
};

const removeMenuItem = (index) => {
  formData.value.menuItems.splice(index, 1);
};

const addImage = () => {
  if (!formData.value.images) {
    formData.value.images = [];
  }
  formData.value.images.push({ url: '' });
};

const removeImage = (index) => {
  formData.value.images.splice(index, 1);
};

const addFeature = () => {
  if (!formData.value.items) {
    formData.value.items = [];
  }
  formData.value.items.push({ title: '', description: '', icon: 'mdi-check' });
};

const removeFeature = (index) => {
  formData.value.items.splice(index, 1);
};

const addTestimonial = () => {
  if (!formData.value.items) {
    formData.value.items = [];
  }
  formData.value.items.push({ name: '', position: '', text: '', avatar: null });
};

const removeTestimonial = (index) => {
  formData.value.items.splice(index, 1);
};

const addField = () => {
  if (!formData.value.fields) {
    formData.value.fields = [];
  }
  formData.value.fields.push({ type: 'text', name: '', label: '', required: false });
};

const removeField = (index) => {
  formData.value.fields.splice(index, 1);
};

const addLink = () => {
  if (!formData.value.links) {
    formData.value.links = [];
  }
  formData.value.links.push({ text: '', url: '' });
};

const removeLink = (index) => {
  formData.value.links.splice(index, 1);
};

const addSocial = () => {
  if (!formData.value.socialMedia) {
    formData.value.socialMedia = [];
  }
  formData.value.socialMedia.push({ icon: 'mdi-facebook', url: '' });
};

const removeSocial = (index) => {
  formData.value.socialMedia.splice(index, 1);
};
</script>

<style scoped>
.component-editor {
  height: 100%;
  overflow-y: auto;
}
</style>
