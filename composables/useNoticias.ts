import { ref, reactive, readonly } from 'vue'
import { API_ROUTES } from '~/config/api'
import type { UseFetchOptions } from '#app'
import { useNoCacheStrategy } from './useNoCacheStrategy'

// Tipo para los datos de una noticia
interface Noticia {
  id: number
  titulo: string
  slug: string
  resumen?: string
  contenido?: string
  fecha_publicacion: string
  imagen_destacada?: {
    url: string
    alt?: string
  }
  categorias?: string[]
  tags?: string[]
  autor?: {
    nombre: string
    avatar?: string
  }
  [key: string]: any // Para campos adicionales
}

// Tipo para la respuesta paginada
interface NoticiasResponse {
  results: Noticia[]
  count: number
  next: string | null
  previous: string | null
  [key: string]: any
}

export function useNoticias() {
  // Obtener estrategias anti-caché
  const { addNoCacheParams, generateUniqueKey } = useNoCacheStrategy()
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = reactive<{
    noticias: Noticia[],
    totalCount: number,
    nextPage: string | null,
    previousPage: string | null
  }>({
    noticias: [],
    totalCount: 0,
    nextPage: null,
    previousPage: null
  })
  
  // Filtros y paginación
  const filters = reactive({
    page: 1,
    pageSize: 10,
    categoria: '',
    tag: '',
    search: ''
  })

  // Opciones para fetch con estrategia anti-caché
  const createFetchOptions = (): UseFetchOptions<NoticiasResponse> => {
    return {
      key: generateUniqueKey(`noticias-data-${JSON.stringify(filters)}`),
      cache: 'no-store',
      server: true,
      lazy: false,
      watch: false,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      },
      // Usar null como valor por defecto para evitar errores de tipo
      default: () => null
    }
  }

  async function fetchNoticias() {
    isLoading.value = true
    error.value = null
    
    try {
      // Construir parámetros para la consulta
      const params: Record<string, string> = {
        page: filters.page.toString(),
        page_size: filters.pageSize.toString()
      }
      
      if (filters.categoria) {
        params.categoria = filters.categoria
      }
      
      if (filters.tag) {
        params.tag = filters.tag
      }
      
      if (filters.search) {
        params.search = filters.search
      }
      
      // Construir URL con parámetros
      const url = new URL(API_ROUTES.NOTICIAS);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      
      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(url.toString());
      console.log(`[useNoticias] URL con parámetros anti-caché: ${noCacheUrl}`);
      
      const { data: noticiasData, error: fetchError } = await useFetch<NoticiasResponse>(
        noCacheUrl,
        createFetchOptions()
      )

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (noticiasData.value) {
        data.noticias = noticiasData.value.results
        data.totalCount = noticiasData.value.count
        data.nextPage = noticiasData.value.next
        data.previousPage = noticiasData.value.previous
      }
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('Error fetching noticias:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Métodos para actualizar filtros
  function setPage(page: number) {
    filters.page = page
    fetchNoticias()
  }
  
  function setPageSize(size: number) {
    filters.pageSize = size
    filters.page = 1 // Reset to page 1 when changing page size
    fetchNoticias()
  }
  
  function setCategoria(categoria: string) {
    filters.categoria = categoria
    filters.page = 1 // Reset to page 1 when changing filters
    fetchNoticias()
  }
  
  function setTag(tag: string) {
    filters.tag = tag
    filters.page = 1 // Reset to page 1 when changing filters
    fetchNoticias()
  }
  
  function setSearch(search: string) {
    filters.search = search
    filters.page = 1 // Reset to page 1 when changing filters
    fetchNoticias()
  }
  
  function resetFilters() {
    filters.page = 1
    filters.categoria = ''
    filters.tag = ''
    filters.search = ''
    fetchNoticias()
  }

  // Carga inicial de datos
  fetchNoticias()

  return {
    noticiasData: readonly(data),
    filters: readonly(filters),
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchNoticias,
    setPage,
    setPageSize,
    setCategoria,
    setTag,
    setSearch,
    resetFilters
  }
}
