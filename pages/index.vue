<template>
  <div>
    <!-- Mostrar página dinámica si existe -->
    <template v-if="homePage && !loading">
      <div class="dynamic-page-container">
        <!-- Encabezado de la página -->
        <div v-if="hasComponentOfType('header')" class="page-section header-section">
          <component-renderer 
            v-for="item in getComponentsOfType('header')"
            :key="item.i"
            :type="item.type" 
            :content="item.content" 
            :is-preview="true" 
          />
        </div>
        
        <!-- Contenido principal -->
        <div class="page-section main-content">
          <div class="container">
            <div class="row q-col-gutter-md">
              <template v-for="item in getSortedContentComponents()" :key="item.i">
                <div :class="`col-12 col-md-${item.w}`">
                  <component-renderer 
                    :type="item.type" 
                    :content="item.content" 
                    :is-preview="true" 
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Pie de página -->
        <div v-if="hasComponentOfType('footer')" class="page-section footer-section">
          <component-renderer 
            v-for="item in getComponentsOfType('footer')"
            :key="item.i"
            :type="item.type" 
            :content="item.content" 
            :is-preview="true" 
          />
        </div>
        <!-- Si no hay footer en la página dinámica, mostrar un espacio en blanco -->
        <div v-else class="empty-footer"></div>
      </div>
    </template>
    
    <!-- Página por defecto si no hay página de inicio configurada -->
    <div v-else-if="!loading" class="landing-page">
      <div class="hero-section">
        <div class="container">
          <h1 class="text-h2 text-weight-bold text-white">CMS Marketing</h1>
          <p class="text-h5 text-white q-mb-xl">Crea páginas web dinámicas con nuestro constructor visual</p>
          <q-btn color="white" text-color="primary" label="Iniciar Sesión" size="lg" to="/admin/login" />
        </div>
      </div>
      
      <div class="features-section">
        <div class="container">
          <h2 class="text-h3 text-center q-mb-xl">Características Principales</h2>
          
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4 feature-item">
              <div class="text-center">
                <q-icon name="mdi-view-grid-plus" color="primary" size="4rem" />
                <h3 class="text-h5 q-mt-md">Constructor de Arrastrar y Soltar</h3>
                <p class="q-mt-sm">Crea páginas web fácilmente arrastrando y soltando componentes en un grid de 12 columnas.</p>
              </div>
            </div>
            
            <div class="col-12 col-md-4 feature-item">
              <div class="text-center">
                <q-icon name="mdi-palette" color="primary" size="4rem" />
                <h3 class="text-h5 q-mt-md">Personalización Total</h3>
                <p class="q-mt-sm">Personaliza cada componente con tu propio contenido, imágenes y estilos.</p>
              </div>
            </div>
            
            <div class="col-12 col-md-4 feature-item">
              <div class="text-center">
                <q-icon name="mdi-responsive" color="primary" size="4rem" />
                <h3 class="text-h5 q-mt-md">Diseño Responsivo</h3>
                <p class="q-mt-sm">Todas las páginas creadas se adaptan automáticamente a cualquier dispositivo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <div class="container">
          <h2 class="text-h3 text-white text-center">¿Listo para comenzar?</h2>
          <p class="text-h6 text-white text-center q-mb-xl">Crea tu primera página en minutos</p>
          <div class="text-center">
            <q-btn color="white" text-color="primary" label="Acceder al Panel" size="lg" to="/admin" />
          </div>
        </div>
      </div>
      
      <footer class="footer-section">
        <div class="container">
          <div class="row">
            <div class="col-12 col-md-6">
              <h4 class="text-h6">CMS Marketing</h4>
              <p>Una solución moderna para crear páginas web dinámicas.</p>
            </div>
            <div class="col-12 col-md-6 text-right">
              <p>© 2025 CMS Marketing. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    
    <!-- Loader mientras se carga la página -->
    <div v-else class="page-loader">
      <q-spinner-dots color="primary" size="60px" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { GridLayout, GridItem } from 'vue3-grid-layout';
import { useApi } from '~/composables/useApi';
import ComponentRenderer from '~/components/builder/ComponentRenderer.vue';

const api = useApi();
const homePage = ref(null);
const loading = ref(true);

// Cargar la página marcada como página de inicio
const loadHomePage = async () => {
  try {
    loading.value = true;
    // Obtener la página de inicio actual
    const homePageData = await api.getHomePageContent();
    // Solo mostrar log en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log('Página de inicio cargada');
    }
    homePage.value = homePageData;
  } catch (error) {
    console.error('Error al cargar la página de inicio:', error);
    homePage.value = null;
  } finally {
    loading.value = false;
  }
};

// Verificar si hay componentes de un tipo específico
const hasComponentOfType = (type) => {
  if (!homePage.value || !homePage.value.content || !homePage.value.content.layout) {
    return false;
  }
  return homePage.value.content.layout.some(item => item.type === type);
};

// Obtener todos los componentes de un tipo específico
const getComponentsOfType = (type) => {
  if (!homePage.value || !homePage.value.content || !homePage.value.content.layout) {
    return [];
  }
  return homePage.value.content.layout.filter(item => item.type === type);
};

// Obtener componentes de contenido ordenados por posición Y
const getSortedContentComponents = () => {
  if (!homePage.value || !homePage.value.content || !homePage.value.content.layout) {
    return [];
  }
  // Filtrar componentes que no son header ni footer
  const contentComponents = homePage.value.content.layout.filter(
    item => item.type !== 'header' && item.type !== 'footer'
  );
  // Ordenar por posición Y (de arriba a abajo)
  return contentComponents.sort((a, b) => a.y - b.y);
};

// Cargar la página de inicio cuando se monta el componente
onMounted(() => {
  loadHomePage();
});
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.hero-section {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
  padding: 120px 0;
  text-align: center;
}

.features-section {
  padding: 100px 0;
  background-color: #f9f9f9;
}

.feature-item {
  padding: 20px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-10px);
}

.cta-section {
  background: linear-gradient(135deg, #26A69A 0%, #00796B 100%);
  padding: 80px 0;
  text-align: center;
}

.footer-section {
  background-color: #f5f5f5;
  padding: 40px 0;
  margin-top: auto; /* Empujar al fondo de la página */
}

.empty-footer {
  height: 40px;
  margin-top: auto; /* Empujar al fondo de la página */
  background-color: transparent;
}

/* Estilos para la página dinámica */
.dynamic-page-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evitar scroll horizontal */
}

.page-section {
  width: 100%;
}

.header-section {
  /* Estilos para la sección de encabezado */
}

.main-content {
  flex: 1;
  padding: 40px 0;
}

.page-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

@media (max-width: 767px) {
  .hero-section {
    padding: 80px 0;
  }
  
  .features-section,
  .cta-section {
    padding: 60px 0;
  }
  
  .main-content {
    padding: 20px 0;
  }
  
  .text-right {
    text-align: left;
    margin-top: 20px;
  }
}
</style>
