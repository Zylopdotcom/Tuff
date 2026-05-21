import { useState } from 'react'
import { languages } from '../data/languages'
import { useTheme } from '../lib/ThemeContext'

type User = {
  username: string
  email: string
  language: string
}

type Props = {
  user: User
  onSettings: () => void
}

const langKey: Record<string, string> = {
  JavaScript: 'javascript',
  Python: 'python',
  Swift: 'swift',
  'C#': 'csharp',
}

export default function Dashboard({ user, onSettings }: Props) {
  const { theme: t } = useTheme()
  const key = langKey[user.language] || 'javascript'
  const lang = languages[key]
  const [activeNav, setActiveNav] = useState('home')

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: t.font, display: 'flex' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .cp-cursor { display:inline-block; width:9px; height:16px; background:${t.primary}; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
        .nav-icon { width:44px; height:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:8px; font-size:18px; transition:background 0.2s; color:${t.secondary}; }
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
          { id: 'home', icon: '⌂' },
          { id: 'roadmap', icon: '◈' },
          { id: 'stats', icon: '▤' },
          { id: 'resources', icon: '◎' },
        ].map(n => (
          <div key={n.id} className={`nav-icon ${activeNav === n.id ? 'active' : ''}`} onClick={() => setActiveNav(n.id)}>
            {n.icon}
          </div>
        ))}
        <div style={{ height: '16px' }} />
        <div className="nav-icon" style={{ fontSize: '14px' }} onClick={onSettings}>⚙</div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '4px' }}>&gt;&gt; DASHBOARD</div>
            <div style={{ color: t.primary, fontSize: '20px', letterSpacing: '2px' }}>Welcome back, {user.username.toUpperCase()}<span className="cp-cursor" /></div>
          </div>
          <div style={{ width: '36px', height: '36px', background: t.border, border: `1px solid ${t.borderSecondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary, fontSize: '14px', letterSpacing: '1px' }}>
            {user.username[0].toUpperCase()}
          </div>
        </div>

        {/* Hero banner */}
        <div style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '16px', right: '24px', color: t.border, fontSize: '48px' }}>{lang.emoji}</div>
          <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>[ ASSIGNED PATH ]</div>
          <div style={{ color: t.primary, fontSize: '28px', letterSpacing: '3px', marginBottom: '8px' }}>{lang.name.toUpperCase()}</div>
          <div style={{ color: t.secondary, fontSize: '12px', lineHeight: 1.8, maxWidth: '600px', marginBottom: '20px' }}>{lang.desc}</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: t.border, border: `1px solid ${t.borderSecondary}`, color: t.primary, padding: '10px 20px', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}>
              [ CONTINUE PATH ]
            </div>
            <div style={{ background: 'transparent', border: `1px solid ${t.secondary}`, color: t.secondary, padding: '10px 20px', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}>
              [ VIEW RESOURCES ]
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
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
        </div>

        {/* Roadmap + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>

          {/* Steps */}
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ LEARNING ROADMAP ]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lang.steps.map((step, i) => (
                <div className="step-card" key={i}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', border: `1px solid ${i === 0 ? t.primary : t.border}`, color: i === 0 ? t.primary : t.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ color: t.primary, fontSize: '13px', letterSpacing: '1px' }}>{step.name}</div>
                        <div style={{ fontSize: '10px', letterSpacing: '1px', color: i === 0 ? t.primary : t.secondary, border: `1px solid ${i === 0 ? t.borderSecondary : t.border}`, padding: '2px 8px' }}>
                          {i === 0 ? 'IN PROGRESS' : 'PENDING'}
                        </div>
                      </div>
                      <div style={{ color: t.secondary, fontSize: '11px', marginBottom: '10px' }}>{step.detail}</div>
                      <div style={{ background: t.bgTertiary, height: '3px', borderRadius: '2px', marginBottom: '10px' }}>
                        <div style={{ height: '100%', width: i === 0 ? '15%' : '0%', background: t.primary, borderRadius: '2px', transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {step.resources.map(r => (
                          <span key={r} style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, color: t.secondary, fontSize: '10px', padding: '3px 10px', letterSpacing: '1px' }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

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

            <div className="stat-card">
              <div style={{ color: t.secondary, fontSize: '9px', letterSpacing: '2px', marginBottom: '16px' }}>[ QUICK RESOURCES ]</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lang.steps.slice(0, 3).flatMap(s => s.resources).slice(0, 5).map(r => (
                  <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.secondary, fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>
                    <span style={{ color: t.primary }}>&gt;&gt;</span> {r}
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card" style={{ borderColor: t.borderSecondary }}>
              <div style={{ color: t.primary, fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>[ DAILY TIP ]</div>
              <div style={{ color: t.secondary, fontSize: '11px', lineHeight: 1.8 }}>
                Code for at least 30 minutes every day. Consistency beats intensity.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}