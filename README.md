# CMS Marketing con Vue

Un sistema de gestión de contenido (CMS) para marketing que permite a los usuarios de marketing crear y editar páginas web dinámicas mediante una interfaz de arrastrar y soltar, similar a WordPress. Desarrollado con Vue.js, Nuxt 3, Quasar y otras tecnologías modernas.

## Características

- **Constructor de páginas visual**: Interfaz de arrastrar y soltar con grid de 12 columnas
- **Componentes personalizables**: Encabezados, contenido, galerías, testimonios, formularios, etc.
- **Diseño responsivo**: Las páginas se adaptan automáticamente a cualquier dispositivo
- **Vista previa en tiempo real**: Visualiza los cambios mientras editas
- **Panel de administración**: Gestión completa de páginas y plantillas
- **API simulada**: Para desarrollo y pruebas sin dependencia de un backend real

## Tecnologías utilizadas

- **Vue.js 3**: Framework JavaScript progresivo
- **Nuxt 3**: Framework para aplicaciones Vue.js
- **Quasar**: Framework UI con componentes Vue.js
- **Vue Grid Layout**: Para la funcionalidad de arrastrar y soltar
- **Firebase** (simulado): Para autenticación y almacenamiento

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
├── api/                # Servicios y datos simulados de API
│   ├── mock/           # Datos simulados para desarrollo
│   └── services.js     # Servicios para interactuar con la API
├── assets/             # Recursos estáticos (imágenes, estilos)
├── components/         # Componentes Vue reutilizables
│   │── api/             # Componentes para el consumo de API
│   │   │── core/        # Componentes centrales del sistema
│   │   │── blocks/      # Componentes básicos de contenido
│   │   │── feature-blocks/ # Componentes especializados
│   │   │── layout/      # Componentes de estructura (navbar, footer)
│   │   │── shared/      # Componentes compartidos
│   │   │── utils/       # Utilidades y helpers
│   │── archived/        # Componentes archivados (no en uso activo)
│   ├── admin/          # Componentes para el panel de administración
│   ├── builder/        # Componentes para el constructor de páginas
│   └── templates/      # Plantillas de componentes para las páginas
├── composables/        # Composables de Vue
│   │── useWagtailApi.js # Composable para interactuar con la API de Wagtail
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas de la aplicación
│   ├── admin/          # Páginas del panel de administración
│   └── preview/        # Páginas de vista previa
└── plugins/            # Plugins de Nuxt
```

## Uso

1. Inicia la aplicación con `npm run dev`
2. Accede a http://localhost:3000
3. Crea una nueva página seleccionando una plantilla
4. Utiliza el constructor de páginas para añadir y personalizar componentes
5. Guarda la página y visualízala en modo de vista previa

## Integración con backend real

Para integrar con un backend real, modifica los archivos en la carpeta `api/` para conectar con tus endpoints reales en lugar de usar los datos simulados.

## Producción

```bash
# Construir para producción
npm run build

# Previsualizar la versión de producción
npm run preview
```

Consulta la [documentación de despliegue de Nuxt](https://nuxt.com/docs/getting-started/deployment) para más información.
