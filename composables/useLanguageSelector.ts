
import { ref, readonly, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const availableLanguages = ref([
  { code: 'es', display_name: 'Español' },
  { code: 'en', display_name: 'English' },
  { code: 'fr', display_name: 'Français' },
  { code: 'pt', display_name: 'Português' },
  { code: 'de', display_name: 'Deutsch' }
])

const isChangingLanguage = ref(false)

export function useLanguageSelector() {
  const route = useRoute()
  const router = useRouter()

  const getCurrentLanguage = (): string => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const lang = pathSegments[0]
    return lang && lang.length === 2 ? lang : 'es'
  }

  const changeLanguage = async (newLang: string) => {
    if (newLang === getCurrentLanguage()) return
    isChangingLanguage.value = true

    try {
      const segments = route.path.split('/').filter(Boolean)
      const rest = segments.slice(1).join('/')
      const newPath = `/${newLang}${rest ? '/' + rest : ''}`

      window.location.href = newPath
    } finally {
      isChangingLanguage.value = false
    }
  }

  return {
    availableLanguages,
    getCurrentLanguage,
    changeLanguage,
    isChangingLanguage: readonly(isChangingLanguage)
  }
}
