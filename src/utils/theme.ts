export type Theme = 'dark' | 'light' | 'auto'

export function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function getCurrentStoredTheme(): Theme {
  return (localStorage.getItem('color-scheme') as Theme) || 'auto'
}

export function getNextTheme(current: Theme): Theme {
  const systemTheme = getSystemTheme()

  if (current === 'light') {
    return systemTheme === 'dark' ? 'auto' : 'dark'
  }
  if (current === 'dark') {
    return systemTheme === 'light' ? 'auto' : 'light'
  }
  return systemTheme === 'light' ? 'dark' : 'light'
}

export function applyTheme(theme: Theme): void {
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', actualTheme)
}

let systemThemeMediaQuery: MediaQueryList | null = null
let systemThemeHandler: (() => void) | null = null

export function setupSystemThemeListener(): void {
  if (systemThemeMediaQuery) {
    return
  }
  systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  systemThemeHandler = () => {
    const currentTheme = getCurrentStoredTheme()
    if (currentTheme === 'auto') {
      applyTheme('auto')
    }
  }

  systemThemeMediaQuery.addEventListener('change', systemThemeHandler)
}

export function cleanupSystemThemeListener(): void {
  if (systemThemeMediaQuery && systemThemeHandler) {
    systemThemeMediaQuery.removeEventListener('change', systemThemeHandler)
    systemThemeMediaQuery = null
    systemThemeHandler = null
  }
}
