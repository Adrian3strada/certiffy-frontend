<template>
  <div class="api-diagnostics-page q-pa-md">
    <h1 class="text-h3 q-mb-lg">Diagnóstico de API Externa</h1>
    
    <!-- Configuración de la API -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h5">Configuración de la API</div>
        <q-separator class="q-my-md" />
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="apiBaseUrl"
              label="URL Base de la API"
              outlined
              :disable="loading"
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="apiEndpoint"
              label="Endpoint"
              outlined
              :disable="loading"
              class="q-mb-md"
            />
          </div>
          <div class="col-12">
            <q-btn
              color="primary"
              label="Probar API"
              :loading="loading"
              @click="testApi"
              class="q-mr-md"
            />
            <q-btn
              color="secondary"
              label="Probar Listado de Páginas"
              :loading="loadingList"
              @click="testPagesList"
              class="q-mr-md"
            />
            <q-btn
              color="accent"
              label="Probar Página Específica"
              :loading="loadingPage"
              @click="testSpecificPage"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Resultados de la prueba -->
    <q-card v-if="apiResponse" class="q-mb-lg">
      <q-card-section>
        <div class="text-h5">Resultados de la Prueba</div>
        <q-separator class="q-my-md" />
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label caption>URL Completa</q-item-label>
                  <q-item-label>{{ fullUrl }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Código de Estado</q-item-label>
                  <q-item-label :class="{ 'text-positive': apiResponse.status === 200, 'text-negative': apiResponse.status !== 200 }">
                    {{ apiResponse.status }} {{ apiResponse.statusText }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Tipo de Contenido</q-item-label>
                  <q-item-label>{{ apiResponse.contentType }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Tiempo de Respuesta</q-item-label>
                  <q-item-label>{{ apiResponse.responseTime }} ms</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          
          <div class="col-12 col-md-6">
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Headers</q-item-label>
                  <q-item-label>
                    <pre class="headers-pre">{{ apiResponse.headers }}</pre>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Respuesta de la API -->
    <q-card v-if="apiResponse && apiResponse.responseText" class="q-mb-lg">
      <q-card-section>
        <div class="text-h5">Respuesta de la API</div>
        <q-separator class="q-my-md" />
        
        <q-tabs
          v-model="responseTab"
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="raw" label="Texto Raw" />
          <q-tab name="preview" label="Vista Previa" v-if="isHtml" />
          <q-tab name="json" label="JSON" v-if="isJson" />
        </q-tabs>
        
        <q-separator />
        
        <q-tab-panels v-model="responseTab" animated>
          <q-tab-panel name="raw">
            <pre class="response-pre">{{ apiResponse.responseText }}</pre>
          </q-tab-panel>
          
          <q-tab-panel name="preview" v-if="isHtml">
            <div class="html-preview" v-html="sanitizedHtml"></div>
          </q-tab-panel>
          
          <q-tab-panel name="json" v-if="isJson">
            <pre class="json-pre">{{ formattedJson }}</pre>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
    
    <!-- Análisis y Recomendaciones -->
    <q-card v-if="apiResponse" class="q-mb-lg">
      <q-card-section>
        <div class="text-h5">Análisis y Recomendaciones</div>
        <q-separator class="q-my-md" />
        
        <div v-if="apiResponse.status !== 200" class="text-negative q-mb-md">
          <q-icon name="mdi-alert" />
          <span class="q-ml-sm">La API devolvió un código de error: {{ apiResponse.status }}</span>
        </div>
        
        <div v-if="isHtml" class="text-warning q-mb-md">
          <q-icon name="mdi-alert-circle" />
          <span class="q-ml-sm">La API está devolviendo HTML en lugar de JSON. Esto puede indicar un error en la configuración del servidor o un problema con la URL.</span>
        </div>
        
        <div v-if="isJson" class="text-positive q-mb-md">
          <q-icon name="mdi-check-circle" />
          <span class="q-ml-sm">La API está devolviendo JSON válido.</span>
        </div>
        
        <div class="text-h6 q-mt-lg">Recomendaciones para el Backend:</div>
        <ul>
          <li v-if="isHtml">Verificar que la URL de la API sea correcta y que el endpoint exista.</li>
          <li v-if="isHtml">Comprobar que el servidor esté configurado para devolver JSON en lugar de HTML para las solicitudes a la API.</li>
          <li v-if="isHtml">Asegurarse de que la autenticación esté configurada correctamente si es necesaria.</li>
          <li v-if="corsIssue">Configurar correctamente los headers CORS en el servidor para permitir solicitudes desde este dominio.</li>
          <li v-if="apiResponse.status === 404">Verificar que la ruta de la API sea correcta.</li>
          <li v-if="apiResponse.status === 401 || apiResponse.status === 403">Verificar que las credenciales de autenticación sean correctas.</li>
        </ul>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Estado
const apiBaseUrl = ref('https://8af2-2806-266-480-8244-9437-a02c-cbc8-6484.ngrok-free.app');
const apiEndpoint = ref('/api/v2/pages/');
const apiResponse = ref(null);
const loading = ref(false);
const loadingList = ref(false);
const loadingPage = ref(false);
const responseTab = ref('raw');

// URL completa
const fullUrl = computed(() => {
  return `${apiBaseUrl.value}${apiEndpoint.value}`;
});

// Comprobar si la respuesta es HTML
const isHtml = computed(() => {
  if (!apiResponse.value || !apiResponse.value.responseText) return false;
  const text = apiResponse.value.responseText.trim();
  return text.startsWith('<!DOCTYPE html>') || text.startsWith('<html') || text.startsWith('<?xml');
});

// Comprobar si la respuesta es JSON
const isJson = computed(() => {
  if (!apiResponse.value || !apiResponse.value.responseText) return false;
  try {
    JSON.parse(apiResponse.value.responseText);
    return true;
  } catch (e) {
    return false;
  }
});

// Formatear JSON para mostrar
const formattedJson = computed(() => {
  if (!isJson.value) return '';
  try {
    return JSON.stringify(JSON.parse(apiResponse.value.responseText), null, 2);
  } catch (e) {
    return apiResponse.value.responseText;
  }
});

// Sanitizar HTML para vista previa
const sanitizedHtml = computed(() => {
  if (!isHtml.value) return '';
  return apiResponse.value.responseText;
});

// Comprobar si hay problemas de CORS
const corsIssue = computed(() => {
  if (!apiResponse.value) return false;
  return apiResponse.value.corsError;
});

// Probar la API
const testApi = async () => {
  loading.value = true;
  apiResponse.value = null;
  
  try {
    const startTime = performance.now();
    
    // Hacer la solicitud
    const response = await fetch(`${apiBaseUrl.value}${apiEndpoint.value}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    // Obtener headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    // Obtener el texto de la respuesta
    const responseText = await response.text();
    
    // Guardar la respuesta
    apiResponse.value = {
      status: response.status,
      statusText: response.statusText,
      headers: JSON.stringify(headers, null, 2),
      contentType: headers['content-type'] || 'No especificado',
      responseText,
      responseTime,
      corsError: false
    };
    
    // Notificar éxito
    $q.notify({
      color: 'positive',
      message: 'Prueba completada',
      icon: 'mdi-check'
    });
  } catch (error) {
    console.error('Error al probar la API:', error);
    
    // Guardar información del error
    apiResponse.value = {
      status: 0,
      statusText: 'Error de conexión',
      headers: '{}',
      contentType: 'No disponible',
      responseText: error.toString(),
      responseTime: 0,
      corsError: error.toString().includes('CORS')
    };
    
    // Notificar error
    $q.notify({
      color: 'negative',
      message: `Error: ${error.toString()}`,
      icon: 'mdi-alert'
    });
  } finally {
    loading.value = false;
  }
};

// Probar el listado de páginas
const testPagesList = async () => {
  loadingList.value = true;
  apiEndpoint.value = '/api/v2/pages/';
  await testApi();
  loadingList.value = false;
};

// Probar una página específica
const testSpecificPage = async () => {
  loadingPage.value = true;
  apiEndpoint.value = '/api/v2/pages/15/';
  await testApi();
  loadingPage.value = false;
};

// Probar la API al montar el componente
onMounted(() => {
  testApi();
});
</script>

<style scoped>
.api-diagnostics-page {
  max-width: 1200px;
  margin: 0 auto;
}

.response-pre, .json-pre, .headers-pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 500px;
  overflow-y: auto;
}

.html-preview {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  max-height: 500px;
  overflow: auto;
}
</style>
