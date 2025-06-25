// Composable para manejar la re-renderización de componentes cuando cambie el idioma
import { ref, onMounted, onUnmounted } from 'vue'

export function useLanguageRerender() {
    const rerenderKey = ref(0)
    let languageChangeListener: ((event: Event) => void) | null = null

    /**
     * Fuerza la re-renderización del componente
     */
    const forceRerender = () => {
        rerenderKey.value++
        console.log('[useLanguageRerender] Forzando re-renderización, nueva clave:', rerenderKey.value)
    }

    /**
     * Escucha eventos de cambio de idioma y fuerza re-renderización
     */
    const setupLanguageListener = () => {
        if (process.client) {
            languageChangeListener = (event: Event) => {
                const customEvent = event as CustomEvent
                const newLang = customEvent?.detail?.language
                if (newLang) {
                    console.log(`[useLanguageRerender] Evento de cambio de idioma detectado: ${newLang}`)
                    forceRerender()
                }
            }

            window.addEventListener('language-changed', languageChangeListener)
        }
    }

    /**
     * Limpia el listener de eventos
     */
    const cleanupLanguageListener = () => {
        if (process.client && languageChangeListener) {
            window.removeEventListener('language-changed', languageChangeListener)
            languageChangeListener = null
        }
    }

    // Configurar automáticamente al montar
    onMounted(() => {
        setupLanguageListener()
    })

    // Limpiar automáticamente al desmontar
    onUnmounted(() => {
        cleanupLanguageListener()
    })

    return {
        rerenderKey: readonly(rerenderKey),
        forceRerender,
        setupLanguageListener,
        cleanupLanguageListener
    }
} 