export type Theme = {
  id: string
  name: string
  bg: string
  bgSecondary: string
  bgTertiary: string
  primary: string
  secondary: string
  border: string
  borderSecondary: string
  font: string
}

export const themes: Record<string, Theme> = {
  hacker: {
    id: 'hacker',
    name: 'HACKER',
    bg: '#050d12',
    bgSecondary: '#071219',
    bgTertiary: '#040b10',
    primary: '#00fff7',
    secondary: '#4af',
    border: '#00fff722',
    borderSecondary: '#00fff744',
    font: "'Share Tech Mono', monospace",
  },
  cyber: {
    id: 'cyber',
    name: 'CYBER',
    bg: '#0d0514',
    bgSecondary: '#130a1e',
    bgTertiary: '#0a0310',
    primary: '#e040fb',
    secondary: '#b39ddb',
    border: '#e040fb22',
    borderSecondary: '#e040fb44',
    font: "'Share Tech Mono', monospace",
  },
  midnight: {
    id: 'midnight',
    name: 'MIDNIGHT',
    bg: '#050a1a',
    bgSecondary: '#0a1428',
    bgTertiary: '#030714',
    primary: '#4d9eff',
    secondary: '#90b8e8',
    border: '#4d9eff22',
    borderSecondary: '#4d9eff44',
    font: "'Share Tech Mono', monospace",
  },
  ghost: {
    id: 'ghost',
    name: 'GHOST',
    bg: '#080808',
    bgSecondary: '#111111',
    bgTertiary: '#050505',
    primary: '#ffffff',
    secondary: '#aaaaaa',
    border: '#ffffff22',
    borderSecondary: '#ffffff44',
    font: "'Share Tech Mono', monospace",
  },
}