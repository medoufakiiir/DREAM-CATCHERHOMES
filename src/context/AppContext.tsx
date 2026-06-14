import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { t, Lang } from '@/i18n/translations'

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  dark: boolean
  toggleDark: () => void
  tr: typeof t.en
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem('dcl-lang') as Lang) ?? 'en'
  )
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dcl-dark')
    return saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dcl-dark', String(dark))
  }, [dark])

  useEffect(() => {
    localStorage.setItem('dcl-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return (
    <AppContext.Provider value={{ lang, setLang, dark, toggleDark: () => setDark(d => !d), tr: t[lang] }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
