// Composable para manejar cambios de idioma de manera centralizada
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNavbar } from '../composables/useNavbar'

export function useLanguageChange() {
    const router = useRouter()
    const route = useRoute()
    const isChangingLanguage = ref(false)

    /**
     * Cambia el idioma de la aplicación de manera completa
     * @param newLang - Nuevo código de idioma (es, en, etc.)
     */
    const changeLanguage = async (newLang: string) => {
        if (isChangingLanguage.value) return // Evitar cambios simultáneos

        try {
            isChangingLanguage.value = true

            // 1. Obtener idioma actual
            const currentLang = getCurrentLanguage()
            if (newLang === currentLang) return

            console.log(`[useLanguageChange] Cambiando idioma de ${currentLang} a ${newLang}`)

            // 2. Actualizar localStorage
            localStorage.setItem('currentLocale', newLang)
            localStorage.setItem('currentLanguage', newLang)

            // 3. Limpiar cachés
            const { clearCaches } = useWagtail()
            clearCaches()

            // 4. Recargar navbar con nuevo idioma (si está disponible)
            try {
                const { refresh: fetchNavbar } = useNavbar()
                await fetchNavbar(newLang)
            } catch (error) {
                console.warn('[useLanguageChange] No se pudo recargar navbar:', error)
            }

            // 5. Disparar evento de cambio de idioma
            if (process.client) {
                console.log(`[useLanguageChange] Disparando evento language-changed para: ${newLang}`)
                window.dispatchEvent(new CustomEvent('language-changed', {
                    detail: {
                        language: newLang,
                        previousLanguage: currentLang,
                        timestamp: Date.now()
                    }
                }))
            }

            // 6. Calcular nueva ruta
            const newPath = calculateNewPath(newLang, currentLang)
            console.log(`[useLanguageChange] Nueva ruta calculada: ${newPath}`)

            // 7. Navegar a la nueva ruta (sin forzar recarga completa)
            await router.push(newPath)
            console.log(`[useLanguageChange] Navegación completada a: ${newPath}`)

            // 8. Dar tiempo para que los eventos se procesen antes de continuar
            await new Promise(resolve => setTimeout(resolve, 200))
            console.log(`[useLanguageChange] Cambio de idioma completado: ${newLang}`)

        } catch (error) {
            console.error('[useLanguageChange] Error al cambiar idioma:', error)
            // Revertir en caso de error
            const currentLang = getCurrentLanguage()
            localStorage.setItem('currentLocale', currentLang)
            localStorage.setItem('currentLanguage', currentLang)
        } finally {
            isChangingLanguage.value = false
        }
    }

    /**
     * Obtiene el idioma actual desde localStorage o URL
     */
    const getCurrentLanguage = (): string => {
        // 1. Intentar desde localStorage
        const savedLang = localStorage?.getItem?.('currentLanguage') ||
            localStorage?.getItem?.('currentLocale')
        if (savedLang) return savedLang

        // 2. Intentar desde URL
        if (route?.path) {
            const pathSegments = route.path.split('/').filter(Boolean)
            if (pathSegments.length > 0) {
                const firstSegment = pathSegments[0].toLowerCase()
                if (firstSegment.length >= 2 && firstSegment.length <= 3) {
                    return firstSegment
                }
            }
        }

        // 3. Valor por defecto
        return 'es'
    }

    /**
     * Calcula la nueva ruta basada en el cambio de idioma
     */
    const calculateNewPath = (newLang: string, currentLang: string): string => {
        const currentPath = route.path

        // Caso especial: página de inicio
        const isHomePage = currentPath === '/' ||
            currentPath === `/${currentLang}` ||
            currentPath === `/${currentLang}/`

        if (isHomePage) {
            return `/${newLang}`
        }

        // Caso general: reemplazar prefijo de idioma
        const hasLanguagePrefix = /^\/[a-z]{2}($|\/)/i.test(currentPath)

        if (hasLanguagePrefix) {
            const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/i, '/')
            if (pathWithoutLang === '/') {
                return `/${newLang}`
            } else {
                return `/${newLang}${pathWithoutLang}`
            }
        } else {
            // Si no tiene prefijo de idioma, agregarlo
            return `/${newLang}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`
        }
    }

    /**
     * Escucha eventos de cambio de idioma
     */
    const onLanguageChange = (callback: (event: CustomEvent) => void) => {
        if (process.client) {
            window.addEventListener('language-changed', callback as EventListener)

            // Retornar función para remover el listener
            return () => {
                window.removeEventListener('language-changed', callback as EventListener)
            }
        }
    }

    return {
        changeLanguage,
        getCurrentLanguage,
        calculateNewPath,
        onLanguageChange,
        isChangingLanguage: readonly(isChangingLanguage)
    }
} 