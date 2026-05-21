import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { themes } from './themes'
import type { Theme } from './themes'

type ThemeContextType = {
  theme: Theme
  setThemeId: (id: string) => void
  themeId: string
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.hacker,
  setThemeId: () => {},
  themeId: 'hacker',
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState('hacker')
  const theme = themes[themeId]

  return (
    <ThemeContext.Provider value={{ theme, setThemeId, themeId }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}