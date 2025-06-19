# CMS Marketing con Vue

Aplicación web SPA (Single Page Application) headless que consume contenido dinámico desde una API de Wagtail CMS. Desarrollada con Vue.js, Nuxt 3, Quasar y tecnologías modernas, la aplicación renderiza de forma dinámica los bloques y componentes basados en la respuesta de la API.

## Características

- **Renderizado dinámico de componentes**: Renderiza automáticamente los componentes basados en el tipo de bloque recibido de la API
- **Rutas dinámicas**: Sistema de rutas que mapea los slugs de la API a páginas en la aplicación
- **Soporte Multilanguage**: Sistema completo para múltiples idiomas con resolución inteligente de rutas
- **Páginas anidadas**: Soporte para páginas hijas y rutas anidadas con resolución automática
- **Manejo de errores robusto**: Fallbacks y mensajes de error amigables para el usuario
- **Proxying de imágenes**: Sistema que gestiona automáticamente las rutas de imágenes para evitar problemas CORS
- **Optimización de memoria**: Sistema de caché inteligente para prevenir fugas de memoria

## Tecnologías utilizadas

- **Vue.js 3**: Framework JavaScript progresivo con Composition API
- **Nuxt 3**: Framework para aplicaciones Vue.js
- **Quasar**: Framework UI con componentes Vue.js
- **useFetch**: Hook nativo de Nuxt para peticiones HTTP

## Instalación

```bash
# Instalar dependencias
npm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev
```

## Estructura del proyecto

```
├── assets/             # Recursos estáticos (imágenes, estilos)
├── components/         # Componentes Vue reutilizables
│   ├── api/             # Componentes para el consumo de API
│   │   └── core/        # Componentes centrales del sistema (DynamicBlockRenderer)
│   │   ├── blocks/      # Componentes básicos (texto, imágenes, botones, hero banners)
│   │   ├── feature-blocks/ # Componentes especializados (carruseles, tarjetas, testimonios)
│   │   ├── layout/      # Componentes de estructura (navbar, footer)
│   │   ├── shared/      # Componentes compartidos
│   │   └── registry.js   # Registro centralizado de componentes
│   └── archived/        # Componentes archivados (no en uso activo)
├── composables/        # Composables de Vue
│   ├── useWagtailApi.js # Composable para interactuar con la API de Wagtail
│   ├── useComponentRegistry.js # Registro dinámico de componentes
│   └── useDynamicPages.js # Manejo de páginas dinámicas
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas de la aplicación
│   ├── index.vue       # Página principal
│   └── [...slug].vue   # Manejador de rutas dinámicas
├── plugins/            # Plugins de Nuxt
│   ├── api-client.js    # Cliente para API
│   └── apiFetch.js      # Utilidad para useFetch
├── public/             # Archivos públicos estáticos
└── server/             # Endpoints de API del lado del servidor
    └── api/            # API endpoints para proxy y funcionalidades del servidor
```

## Uso

1. Inicia la aplicación con `npm run dev`
2. Accede a http://localhost:3000
3. La aplicación carga dinámicamente el contenido desde la API de Wagtail
4. Navega a otras páginas utilizando los enlaces del menú
5. La aplicación renderiza automáticamente los componentes según los tipos de bloques recibidos

## Configuración de la API

La aplicación requiere una API de Wagtail CMS. Configura la URL base de la API en el archivo `.env`:

```
NUXT_PUBLIC_API_BASE=https://tu-url-de-api-wagtail.com
```

Además, asegúrate de que el servidor Wagtail tenga habilitada la API y que los tipos de bloques correspondan con los componentes registrados en `components/api/registry.js`.

## Configuración Multilanguage

La aplicación soporta múltiples idiomas y resuelve automáticamente las rutas basadas en el prefijo de idioma.

```
/es/servicios            # Página en español
/en/services            # Misma página en inglés
```

Para configurar los idiomas disponibles:

1. Asegúrate de que tu API de Wagtail tenga habilitado el soporte multilanguage
2. Las peticiones a la API incluirán automáticamente el parámetro `locale`
3. El sistema detecta el idioma desde la URL y carga el contenido apropiado

## Páginas Anidadas (Hijas)

La aplicación soporta páginas anidadas (páginas hijas) y resuelve correctamente rutas como:

```
/servicios/consultoria
/productos/software/aplicaciones
```

El sistema de resolución de rutas:

1. Analiza la ruta completa e identifica la estructura de páginas anidadas
2. Busca coincidencias de slug en el mapa de páginas del CMS
3. Carga la página hija correcta con todos sus bloques y componentes

## Configuración para Producción

Para desplegar la aplicación en un entorno de producción, sigue estos pasos:

### 1. Configuración de Variables de Entorno

Crea un archivo `.env.production` en la raíz del proyecto con las variables necesarias:

```
# URL base de la API de Wagtail (requerida)
NUXT_PUBLIC_API_BASE=https://tu-url-api-wagtail-produccion.com

# URL del frontend (opcional, para enlaces absolutos)
NUXT_PUBLIC_FRONTEND_URL=https://tu-dominio-produccion.com

# Imagen de placeholder por defecto (opcional)
NUXT_PUBLIC_DEFAULT_PLACEHOLDER_IMAGE=/img/placeholder-default.jpg
```

### 2. Construcción de la Aplicación

```bash
# Instalar dependencias en modo producción (sin devDependencies)
npm ci --only=production

# Construir para producción
npm run build

# Generar estáticos (opcional, para despliegue estático)
npm run generate
```

### 3. Despliegue

Puedes desplegar la aplicación de varias maneras:

#### Opción 1: Despliegue en un servidor Node.js
```bash
# Iniciar en producción
node .output/server/index.mjs
```

#### Opción 2: Despliegue en servicios serverless o CDN
Si has generado la versión estática con `npm run generate`, puedes subir todo el contenido de la carpeta `.output/public` a cualquier servicio de hosting estático como Vercel, Netlify, Firebase Hosting, etc.

#### Opción 3: Despliegue con Docker
```bash
# Construir imagen Docker
docker build -t cms-marketing-vue .

# Ejecutar contenedor
docker run -p 3000:3000 -e NUXT_PUBLIC_API_BASE=https://tu-api.com cms-marketing-vue
```

### 4. Verificación de Producción

Una vez desplegada la aplicación, verifica que:

1. La conexión con la API de Wagtail funciona correctamente
2. Todas las imágenes y recursos multimedia se cargan correctamente
3. No aparecen mensajes de error en la consola del navegador
4. La navegación entre páginas funciona fluidamente

## Cambios Recientes

### Limpieza para Producción (Junio 2025)
- Se eliminaron todos los console.log, console.warn y console.error del código
- Se eliminaron URLs hardcodeadas en favor de variables de entorno configurables
- Se corrigió la implementación del proxy para imágenes
- Se mejoró el manejo de errores y fallbacks
- Se optimizó el rendimiento de carga de componentes dinámicos
npm run build
```

### 3. Opciones de Despliegue

#### A) Servidor Node.js

Para ejecutar en un servidor Node.js:

```bash
# Iniciar en modo producción
node .output/server/index.mjs
```

#### B) Despliegue Estático (Static Hosting)

Si prefieres generar archivos estáticos para CDN o hosting estático:

```bash
# Configurar en nuxt.config.ts
nitro: {
  preset: 'static'
}

# Generar archivos estáticos
npm run generate
```

Los archivos se generarán en el directorio `.output/public/`.

#### C) Despliegue con Docker

Crea un `Dockerfile` en la raíz del proyecto:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci --only=production
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

Construye y ejecuta la imagen Docker:

```bash
docker build -t cms-marketing-vue .
docker run -p 3000:3000 cms-marketing-vue
```

### 4. Consideraciones Adicionales para Producción

- **Proxy Inverso**: Configura un proxy inverso como Nginx para servir la aplicación
- **SSL/TLS**: Implementa certificados SSL para HTTPS
- **Caché**: Configura encabezados de caché para recursos estáticos
- **Monitoreo**: Implementa herramientas de monitoreo como PM2

```nginx
# Ejemplo de configuración básica de Nginx
server {
    listen 80;
    server_name tudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. Gestión de CORS en Producción

Asegúrate de que tu API Wagtail tenga configurados correctamente los encabezados CORS para permitir peticiones desde el dominio de tu frontend:

```python
# En settings.py de tu proyecto Wagtail
CORS_ALLOWED_ORIGINS = [
    "https://tudominio.com"
]
```

Consulta la [documentación de despliegue de Nuxt](https://nuxt.com/docs/getting-started/deployment) para más información sobre opciones avanzadas de despliegue.
