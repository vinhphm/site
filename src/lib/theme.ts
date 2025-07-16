export type Theme = 'dark' | 'light' | 'auto'

export function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getCurrentStoredTheme(): Theme {
  return localStorage.getItem('color-scheme') as Theme || 'auto'
}

export function getNextTheme(current: Theme): Theme {
  const systemTheme = getSystemTheme()

  if (current === 'light') {
    return systemTheme === 'dark' ? 'auto' : 'dark'
  } else if (current === 'dark') {
    return systemTheme === 'light' ? 'auto' : 'light'
  } else {
    return systemTheme === 'light' ? 'dark' : 'light'
  }
}

export function applyTheme(theme: Theme): void {
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', actualTheme)
}

export function setupThemeListener(): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = () => {
    const currentTheme = getCurrentStoredTheme()
    if (currentTheme === 'auto') {
      applyTheme('auto')
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  
  return () => mediaQuery.removeEventListener('change', handleChange)
}