import { ref, reactive, readonly } from 'vue'
import { API_ROUTES } from '~/config/api'
import type { UseFetchOptions } from '#app'

// Tipos para categorías y tags
interface Categoria {
  id: number
  nombre: string
  slug: string
  descripcion?: string
  count?: number // cantidad de noticias con esta categoría
}

interface Tag {
  id: number
  nombre: string
  slug: string
  count?: number // cantidad de noticias con este tag
}

interface CategoriaTagsResponse {
  categorias: Categoria[]
  tags: Tag[]
  [key: string]: any // Para campos adicionales
}

export function useCategoriasTags() {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = reactive<{
    categorias: Categoria[],
    tags: Tag[]
  }>({
    categorias: [],
    tags: []
  })

  // Opciones para fetch
  const options: UseFetchOptions<CategoriaTagsResponse> = {
    key: 'categorias-tags-data',
    cache: true,
    server: true,
    lazy: false,
    watch: false,
    default: () => ({
      categorias: [],
      tags: []
    })
  }

  async function fetchCategoriasTags() {
    isLoading.value = true
    error.value = null
    
    try {
      const { data: categoriasTagsData, error: fetchError } = await useFetch<CategoriaTagsResponse>(
        API_ROUTES.CATEGORIAS_TAGS,
        options
      )

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (categoriasTagsData.value) {
        data.categorias = categoriasTagsData.value.categorias
        data.tags = categoriasTagsData.value.tags
      }
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
      // console.error('Error fetching categorias y tags:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Carga inicial de datos
  fetchCategoriasTags()

  // Funciones helper
  function getCategoriaBySlug(slug: string): Categoria | undefined {
    return data.categorias.find(cat => cat.slug === slug)
  }
  
  function getTagBySlug(slug: string): Tag | undefined {
    return data.tags.find(tag => tag.slug === slug)
  }

  return {
    categoriasTagsData: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchCategoriasTags,
    getCategoriaBySlug,
    getTagBySlug
  }
}
