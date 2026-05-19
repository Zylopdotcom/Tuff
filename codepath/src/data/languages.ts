export type Language = {
  id: string
  name: string
  emoji: string
  desc: string
  steps: { name: string; detail: string; resources: string[] }[]
}

export const languages: Record<string, Language> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    emoji: '🌐',
    desc: 'The language of the web — runs in every browser, powers interactive sites and full-stack apps. Huge job market, fast visible results.',
    steps: [
      { name: 'HTML & CSS basics', detail: 'Build your first webpage', resources: ['freeCodeCamp', 'MDN Docs'] },
      { name: 'JavaScript fundamentals', detail: 'Variables, functions, loops, DOM', resources: ['javascript.info', 'Eloquent JS'] },
      { name: 'React framework', detail: 'Build dynamic UIs', resources: ['react.dev', 'Scrimba'] },
      { name: 'Node.js & backend', detail: 'APIs, databases, server logic', resources: ['The Odin Project'] },
      { name: 'Deploy a project', detail: 'Portfolio piece on GitHub + Vercel', resources: ['Vercel', 'GitHub'] },
    ],
  },
  python: {
    id: 'python',
    name: 'Python',
    emoji: '🐍',
    desc: 'Clear, readable syntax perfect for data science, AI/ML, scripting, and automation. The most popular first language for a reason.',
    steps: [
      { name: 'Python basics', detail: 'Variables, lists, dicts, functions', resources: ['Python.org', 'Automate the Boring Stuff'] },
      { name: 'Data libraries', detail: 'NumPy, Pandas, Matplotlib', resources: ['Kaggle Learn', 'Real Python'] },
      { name: 'Machine learning intro', detail: 'Scikit-learn, basic models', resources: ['fast.ai', 'Coursera ML'] },
      { name: 'Your first data project', detail: 'Analyze a real dataset end-to-end', resources: ['Kaggle Datasets'] },
      { name: 'Share on GitHub', detail: 'Jupyter notebooks + README', resources: ['GitHub Docs'] },
    ],
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    emoji: '📱',
    desc: "Apple's modern language for iOS and macOS apps. Clean syntax, powerful tooling with Xcode, and direct path to the App Store.",
    steps: [
      { name: 'Swift basics', detail: 'Types, optionals, closures', resources: ['Swift.org', 'Hacking with Swift'] },
      { name: 'SwiftUI fundamentals', detail: 'Build your first screen', resources: ['Apple Tutorials', '100 Days of SwiftUI'] },
      { name: 'App architecture', detail: 'State, data flow, MVVM', resources: ['SwiftUI by Example'] },
      { name: 'Publish to TestFlight', detail: 'Real device testing', resources: ['Apple Developer Docs'] },
      { name: 'App Store launch', detail: 'Portfolio + first users', resources: ['App Store Connect'] },
    ],
  },
  csharp: {
    id: 'csharp',
    name: 'C# / Unity',
    emoji: '🎮',
    desc: 'The go-to for game dev with Unity. Also widely used for enterprise software. Structured, powerful, great job market in gaming.',
    steps: [
      { name: 'C# basics', detail: 'Syntax, OOP, classes', resources: ['Microsoft Learn', 'C# Yellow Book'] },
      { name: 'Unity editor basics', detail: 'GameObjects, scenes, physics', resources: ['Unity Learn', 'Brackeys YouTube'] },
      { name: 'Your first 2D game', detail: 'Platformer or top-down shooter', resources: ['Unity Tutorials'] },
      { name: 'Level design & polish', detail: 'Audio, UI, particles', resources: ['Game Dev TV'] },
      { name: 'Publish on itch.io', detail: 'Share your game with the world', resources: ['itch.io'] },
    ],
  },
}

export function recommend(goal: string, math: string): string {
  if (goal === 'data') return 'python'
  if (goal === 'mobile') return 'swift'
  if (goal === 'games') return 'csharp'
  if (math === 'high') return 'python'
  return 'javascript'
}