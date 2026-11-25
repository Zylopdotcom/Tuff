import { useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import type { Step } from '../data/languages'
import LevelView from './LevelView'

type Props = {
  step: Step
  stepIndex: number
  language: string
  earlierSteps: string[]
  // Indexes of the levels in this step the learner has completed (saved progress).
  completedLevels: number[]
  onLevelComplete: (levelIndex: number) => void
  onEvent: (levelIndex: number, e: { kind: 'quiz' | 'review' | 'hint' | 'error_explained'; correct?: boolean; detail?: Record<string, unknown> }) => void
  onBack: () => void
}

export default function StepView({ step, stepIndex, language, earlierSteps, completedLevels, onLevelComplete, onEvent, onBack }: Props) {
  const { theme: t } = useTheme()
  const [activeLevel, setActiveLevel] = useState<number | null>(null)

  if (activeLevel !== null) {
    return (
      <LevelView
        level={step.levels[activeLevel]}
        levelIndex={activeLevel}
        totalLevels={step.levels.length}
        stepName={step.name}
        language={language}
        covered={[...earlierSteps.map(name => `${name} (earlier step)`), ...step.levels.slice(0, activeLevel).map(l => l.title)]}
        onEvent={e => onEvent(activeLevel, e)}
        onBack={() => setActiveLevel(null)}
        onComplete={() => {
          onLevelComplete(activeLevel)
          setActiveLevel(null)
        }}
      />
    )
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: t.font, padding: '40px' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .level-card { background:${t.bgSecondary}; border:1px solid ${t.border}; padding:20px 24px; cursor:pointer; transition:all 0.2s; animation:fadeIn 0.3s ease; }
        .level-card:hover { border-color:${t.primary}; transform:translateX(4px); }
        .level-card.locked { opacity:0.4; cursor:not-allowed; }
        .level-card.locked:hover { border-color:${t.border}; transform:none; }
        .level-card.completed { border-color:${t.primary}44; }
      `}</style>

      <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.secondary, padding: '8px 20px', fontFamily: t.font, fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', marginBottom: '32px' }}>
        ← BACK
      </button>

      <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>
        STEP {String(stepIndex + 1).padStart(2, '0')}
      </div>
      <div style={{ color: t.primary, fontSize: '28px', letterSpacing: '2px', marginBottom: '8px' }}>{step.name}</div>
      <div style={{ color: t.secondary, fontSize: '13px', marginBottom: '40px' }}>{step.detail}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px' }}>[ LEVELS ]</div>
        <div style={{ color: t.secondary, fontSize: '10px' }}>{completedLevels.length}/{step.levels.length} complete</div>
        <div style={{ flex: 1, height: '2px', background: t.bgTertiary }}>
          <div style={{ height: '100%', width: `${(completedLevels.length / step.levels.length) * 100}%`, background: t.primary, transition: 'width 0.5s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {step.levels.map((level, i) => {
          const isCompleted = completedLevels.includes(i)
          const isLocked = i > 0 && !completedLevels.includes(i - 1)
          const isCurrent = !isLocked && !isCompleted

          return (
            <div
              key={i}
              className={`level-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isLocked && setActiveLevel(i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${isCompleted ? t.primary : isLocked ? t.border : t.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {isCompleted ? '✓' : isLocked ? '🔒' : String(i + 1)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: isLocked ? t.secondary : t.primary, fontSize: '14px', letterSpacing: '1px' }}>{level.title}</div>
                  <div style={{ color: t.secondary, fontSize: '11px', marginTop: '2px' }}>{level.concept}</div>
                </div>
                {isCurrent && (
                  <div style={{ color: t.primary, fontSize: '10px', border: `1px solid ${t.borderSecondary}`, padding: '3px 10px', letterSpacing: '1px' }}>
                    START →
                  </div>
                )}
                {isCompleted && (
                  <div style={{ color: t.primary, fontSize: '10px', letterSpacing: '1px' }}>DONE ✓</div>
                )}
                {isLocked && (
                  <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '1px' }}>LOCKED</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}