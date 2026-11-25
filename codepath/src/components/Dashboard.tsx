import StepView from './StepView'
import Interview from './Interview'
import { useState, useEffect, useRef } from 'react'
import { resolvePath } from '../data/languages'
import { useTheme } from '../lib/ThemeContext'
import { supabase } from '../lib/supabase'
import { BADGES, badgeById, streakBadges, interviewBadges } from '../lib/badges'

type User = {
  username: string
  email: string
  language: string
  avatar_url?: string
  streak?: number
  last_login?: string
  login_dates?: string[]
  badges?: string[]
}

type Props = {
  user: User
  onSettings: () => void
  onUserUpdate: (updates: Partial<User>) => void
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getLast90Days() {
  const days = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export default function Dashboard({ user, onSettings, onUserUpdate }: Props) {
  const { theme: t } = useTheme()
  const lang = resolvePath(user.language)
  const [activeNav, setActiveNav] = useState('home')
  const avatarUrl = user.avatar_url || ''
  const [streak, setStreak] = useState(user.streak || 0)
  const [loginDates, setLoginDates] = useState<string[]>(user.login_dates || [])
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const [badges, setBadges] = useState<string[]>(user.badges || [])
  // Mirrors `badges` so awards made in quick succession never see a stale list.
  const badgesRef = useRef<string[]>(user.badges || [])
  const [toasts, setToasts] = useState<string[]>([])

  // Awards any badges not earned yet, saves them, and queues an unlock pop-up for each.
  async function award(ids: string[]) {
    const fresh = ids.filter(id => badgeById(id) && !badgesRef.current.includes(id))
    if (fresh.length === 0) return
    const next = [...badgesRef.current, ...fresh]
    badgesRef.current = next
    setBadges(next)
    setToasts(prev => [...prev, ...fresh])
    onUserUpdate({ badges: next })
    const { error } = await supabase.from('users').update({ badges: next }).eq('email', user.email)
    if (error) console.error('Failed to save badges:', error.message)
  }

  // Show each unlock pop-up for a few seconds, one at a time.
  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => setToasts(prev => prev.slice(1)), 3500)
    return () => clearTimeout(timer)
  }, [toasts])

  useEffect(() => {
    // Everyone on the dashboard got their path from EduBot; existing streaks count too.
    award(['pathfinder', ...streakBadges(user.streak || 0)])
    updateStreak()
  }, [])

  async function updateStreak() {
    const today = getToday()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const currentDates = user.login_dates || []
    if (currentDates.includes(today)) return
    const newDates = [...currentDates, today]
    let newStreak = 1
    if (currentDates.includes(yesterdayStr)) newStreak = (user.streak || 0) + 1
    await supabase.from('users').update({ streak: newStreak, last_login: today, login_dates: newDates }).eq('email', user.email)
    setStreak(newStreak)
    setLoginDates(newDates)
    award(streakBadges(newStreak))
  }

  const days = getLast90Days()
  const weeks: string[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: t.font, display: 'flex' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .cp-cursor { display:inline-block; width:9px; height:16px; background:${t.primary}; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
        .nav-icon { width:64px; padding:8px 0 6px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer; border-radius:8px; font-size:18px; transition:background 0.2s; color:${t.secondary}; border:1px solid transparent; }
        .nav-label { font-size:9px; letter-spacing:0.5px; line-height:1; text-transform:uppercase; }
        .nav-icon:hover { background:${t.border}; color:${t.primary}; }
        .nav-icon.active { background:${t.border}; color:${t.primary}; border:1px solid ${t.borderSecondary}; }
        .step-card { background:${t.bgSecondary}; border:1px solid ${t.border}; padding:20px; transition:border-color 0.2s; animation:fadeIn 0.4s ease; }
        .step-card:hover { border-color:${t.borderSecondary}; }
        .stat-card { background:${t.bgSecondary}; border:1px solid ${t.border}; padding:20px 24px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: '72px', background: t.bgTertiary, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: '8px', flexShrink: 0 }}>
        <div style={{ color: t.primary, fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '1px' }}>CP</div>
        {[
          { id: 'home', icon: '⌂', label: 'Home' },
          { id: 'roadmap', icon: '◈', label: 'Roadmap' },
          { id: 'stats', icon: '▤', label: 'Stats' },
          { id: 'resources', icon: '◎', label: 'Resources' },
          { id: 'interview', icon: '◇', label: 'Mock Interview', short: 'Interview' },
        ].map(n => (
          <div key={n.id} className={`nav-icon ${activeNav === n.id ? 'active' : ''}`} onClick={() => setActiveNav(n.id)} title={n.label}>
            <span>{n.icon}</span>
            <span className="nav-label">{'short' in n ? n.short : n.label}</span>
          </div>
        ))}
        <div style={{ height: '16px' }} />
        <div className="nav-icon" onClick={onSettings} title="Settings">
          <span style={{ fontSize: '14px' }}>⚙</span>
          <span className="nav-label">Settings</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '4px' }}>&gt;&gt; {activeNav.toUpperCase()}</div>
            <div style={{ color: t.primary, fontSize: '20px', letterSpacing: '2px' }}>Welcome back, {user.username.toUpperCase()}<span className="cp-cursor" /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {badges.length > 0 && (
              <div onClick={() => setActiveNav('stats')} title="Your badges" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                {badges.slice(-4).reverse().map(id => {
                  const b = badgeById(id)
                  return b && (
                    <div key={id} title={`${b.name}: ${b.how}`} style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.bgSecondary, border: `1px solid ${t.borderSecondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      {b.icon}
                    </div>
                  )
                })}
                {badges.length > 4 && <div style={{ color: t.secondary, fontSize: '11px', letterSpacing: '1px' }}>+{badges.length - 4}</div>}
              </div>
            )}
            <div onClick={onSettings} style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.border, border: `2px solid ${t.borderSecondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary, fontSize: '16px', overflow: 'hidden', cursor: 'pointer' }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.username[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* HOME VIEW */}
        {activeNav === 'home' && (
          <div>
            {/* Hero banner */}
            <div style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '16px', right: '24px', fontSize: '48px', opacity: 0.3 }}>{lang.emoji}</div>
              <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>[ ASSIGNED PATH ]</div>
              <div style={{ color: t.primary, fontSize: '28px', letterSpacing: '3px', marginBottom: '8px' }}>{lang.field.toUpperCase()}</div>
              <div style={{ color: t.secondary, fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>FIRST LANGUAGE: <span style={{ color: t.primary }}>{lang.firstLanguage.toUpperCase()}</span></div>
              <div style={{ color: t.secondary, fontSize: '12px', lineHeight: 1.8, maxWidth: '600px', marginBottom: '20px' }}>{lang.desc}</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div onClick={() => setActiveNav('roadmap')} style={{ background: t.border, border: `1px solid ${t.borderSecondary}`, color: t.primary, padding: '10px 20px', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}>[ CONTINUE PATH ]</div>
                <div onClick={() => setActiveNav('resources')} style={{ background: 'transparent', border: `1px solid ${t.secondary}`, color: t.secondary, padding: '10px 20px', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}>[ VIEW RESOURCES ]</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'TOTAL STEPS', value: String(lang.steps.length).padStart(2, '0') },
                { label: 'COMPLETED', value: '00' },
                { label: 'IN PROGRESS', value: '01' },
                { label: 'EST. WEEKS', value: '12' },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '2px', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ color: t.primary, fontSize: '28px' }}>{s.value}</div>
                </div>
              ))}
              <div className="stat-card" style={{ border: `1px solid ${streak > 0 ? '#ff6b2b' : t.border}`, textAlign: 'center' }}>
                <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '2px', marginBottom: '4px' }}>STREAK</div>
                <div style={{ fontSize: '20px' }}>{streak > 0 ? '🔥' : '💤'}</div>
                <div style={{ color: streak > 0 ? '#ff6b2b' : t.secondary, fontSize: '24px', lineHeight: 1 }}>{streak}</div>
              </div>
            </div>

            {/* Next steps + right sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
              <div>
                <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ NEXT STEPS ]</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lang.steps.slice(0, 2).map((step, i) => (
                    <div className="step-card" key={i}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', border: `1px solid ${i === 0 ? t.primary : t.border}`, color: i === 0 ? t.primary : t.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: t.primary, fontSize: '13px', letterSpacing: '1px' }}>{step.name}</div>
                          <div style={{ color: t.secondary, fontSize: '11px' }}>{step.detail}</div>
                        </div>
                        <div style={{ fontSize: '10px', color: i === 0 ? t.primary : t.secondary, border: `1px solid ${i === 0 ? t.borderSecondary : t.border}`, padding: '2px 8px' }}>
                          {i === 0 ? 'IN PROGRESS' : 'PENDING'}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div onClick={() => setActiveNav('roadmap')} style={{ color: t.primary, fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', padding: '12px 0' }}>
                    &gt;&gt; VIEW FULL ROADMAP
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Progress */}
                <div className="stat-card">
                  <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '2px', marginBottom: '16px' }}>[ PROGRESS ]</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, i) => (
                      <div key={w}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: t.secondary, fontSize: '10px' }}>{w}</span>
                          <span style={{ color: t.secondary, fontSize: '10px' }}>{i === 0 ? '15%' : '0%'}</span>
                        </div>
                        <div style={{ background: t.bgTertiary, height: '3px' }}>
                          <div style={{ height: '100%', width: i === 0 ? '15%' : '0%', background: t.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="stat-card">
                  <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '3px', marginBottom: '12px' }}>[ ACTIVITY ]</div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {weeks.map((week, wi) => (
                      <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {week.map(day => {
                          const isToday = day === getToday()
                          const isActive = loginDates.includes(day)
                          return (
                            <div key={day} title={day} style={{ width: '8px', height: '8px', borderRadius: '1px', background: isToday ? t.primary : isActive ? t.primary + '99' : t.bgTertiary, boxShadow: isToday ? `0 0 4px ${t.primary}` : isActive ? `0 0 2px ${t.primary}44` : 'none' }} />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: t.primary }} />
                      <span style={{ color: t.secondary, fontSize: '9px' }}>Today</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: t.primary + '99' }} />
                      <span style={{ color: t.secondary, fontSize: '9px' }}>Active</span>
                    </div>
                  </div>
                </div>

                {/* Daily Tip */}
                <div className="stat-card" style={{ borderColor: t.borderSecondary }}>
                  <div style={{ color: t.primary, fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>[ DAILY TIP ]</div>
                  <div style={{ color: t.secondary, fontSize: '11px', lineHeight: 1.8 }}>
                    Code for at least 30 minutes every day. Consistency beats intensity.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROADMAP VIEW */}
{activeNav === 'roadmap' && (
  activeStep !== null ? (
    <StepView
      step={lang.steps[activeStep]}
      stepIndex={activeStep}
      language={lang.firstLanguage}
      earlierSteps={lang.steps.slice(0, activeStep).map(st => st.name)}
      onLevelComplete={(done, total) => award(['first-level', ...(done === total ? ['step-cleared'] : [])])}
      onBack={() => setActiveStep(null)}
    />
  ) : (
    <div>
      <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; FULL ROADMAP</div>
      <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>{lang.name} Learning Path</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lang.steps.map((step, i) => (
          <div className="step-card" key={i} onClick={() => setActiveStep(i)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', border: `1px solid ${i === 0 ? t.primary : t.border}`, color: i === 0 ? t.primary : t.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ color: t.primary, fontSize: '15px', letterSpacing: '1px' }}>{step.name}</div>
                  <div style={{ fontSize: '10px', color: i === 0 ? t.primary : t.secondary, border: `1px solid ${i === 0 ? t.borderSecondary : t.border}`, padding: '3px 10px' }}>
                    {i === 0 ? 'IN PROGRESS' : 'PENDING'} →
                  </div>
                </div>
                <div style={{ color: t.secondary, fontSize: '12px', marginBottom: '12px' }}>{step.detail}</div>
                <div style={{ background: t.bgTertiary, height: '4px', borderRadius: '2px', marginBottom: '12px' }}>
                  <div style={{ height: '100%', width: i === 0 ? '15%' : '0%', background: t.primary, borderRadius: '2px', transition: 'width 0.5s' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {step.resources.map(r => (
                    <span key={r} style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, color: t.secondary, fontSize: '11px', padding: '4px 12px', letterSpacing: '1px' }}>{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
)}

        {/* STATS VIEW */}
        {activeNav === 'stats' && (
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; STATISTICS</div>
            <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>Your Progress</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'TOTAL STEPS', value: String(lang.steps.length).padStart(2, '0'), desc: 'in your path' },
                { label: 'COMPLETED', value: '00', desc: 'steps done' },
                { label: 'CURRENT STREAK', value: `${streak}🔥`, desc: 'days in a row' },
              ].map(s => (
                <div className="stat-card" key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '2px', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ color: t.primary, fontSize: '36px', marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ color: t.secondary, fontSize: '10px' }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ BADGES · {badges.length}/{BADGES.length} ]</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '32px' }}>
              {BADGES.map(b => {
                const earned = badges.includes(b.id)
                return (
                  <div key={b.id} className="stat-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '14px 16px', opacity: earned ? 1 : 0.45, borderColor: earned ? t.borderSecondary : t.border }}>
                    <div style={{ fontSize: '24px', filter: earned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
                    <div>
                      <div style={{ color: earned ? t.primary : t.secondary, fontSize: '12px', letterSpacing: '1px', marginBottom: '2px' }}>{b.name}</div>
                      <div style={{ color: t.secondary, fontSize: '10px', lineHeight: 1.5 }}>{earned ? 'Earned' : b.how}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ ACTIVITY CALENDAR ]</div>
            <div className="stat-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {week.map(day => {
                      const isToday = day === getToday()
                      const isActive = loginDates.includes(day)
                      return (
                        <div key={day} title={day} style={{ width: '14px', height: '14px', borderRadius: '2px', background: isToday ? t.primary : isActive ? t.primary + '99' : t.bgTertiary, border: isToday ? `1px solid ${t.primary}` : '1px solid transparent', boxShadow: isToday ? `0 0 6px ${t.primary}` : isActive ? `0 0 3px ${t.primary}44` : 'none' }} />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ STEP STATUS ]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lang.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ color: t.secondary, fontSize: '11px' }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ color: t.primary, fontSize: '12px' }}>{step.name}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: i === 0 ? t.primary : t.secondary, border: `1px solid ${i === 0 ? t.borderSecondary : t.border}`, padding: '2px 10px' }}>
                    {i === 0 ? 'IN PROGRESS' : 'PENDING'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERVIEW VIEW */}
        {activeNav === 'interview' && <Interview path={lang} onFinish={pct => award(interviewBadges(pct))} />}

        {/* RESOURCES VIEW */}
        {activeNav === 'resources' && (
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; RESOURCES</div>
            <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>Learning Materials</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {lang.steps.map((step, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ color: t.secondary, fontSize: '10px' }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ color: t.primary, fontSize: '13px', letterSpacing: '1px' }}>{step.name}</div>
                    <div style={{ flex: 1, height: '1px', background: t.border }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {step.resources.map(r => (
                      <div key={r} style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = t.primary)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
                      >
                        <div style={{ color: t.primary, fontSize: '12px', letterSpacing: '1px', marginBottom: '4px' }}>{r}</div>
                        <div style={{ color: t.secondary, fontSize: '10px' }}>&gt;&gt; Open resource</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {toasts.length > 0 && (() => {
        const b = badgeById(toasts[0])
        return b && (
          <div key={toasts[0]} role="status" style={{ position: 'fixed', right: '24px', bottom: '24px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '14px', background: t.bgSecondary, border: `1px solid ${t.primary}`, padding: '14px 20px', boxShadow: `0 0 24px ${t.primary}33`, animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '30px' }}>{b.icon}</div>
            <div>
              <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '3px', marginBottom: '4px' }}>BADGE UNLOCKED</div>
              <div style={{ color: t.primary, fontSize: '14px', letterSpacing: '1px' }}>{b.name}</div>
              <div style={{ color: t.secondary, fontSize: '10px', marginTop: '2px' }}>{b.how}</div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}