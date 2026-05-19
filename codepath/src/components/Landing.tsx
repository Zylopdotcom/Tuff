import '@fontsource/share-tech-mono'
import { useEffect, useRef } from 'react'

type Props = {
  onStart: () => void
}

export default function Landing({ onStart }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'
    for (let i = 0; i < 25; i++) {
      const col = document.createElement('div')
      col.style.cssText = `
        position:absolute; top:0; color:#00fff722; font-size:11px;
        font-family:'Share Tech Mono',monospace;
        left:${i * 4.2}%; animation:fall ${3 + Math.random() * 5}s linear infinite;
        animation-delay:${-Math.random() * 8}s;
      `
      let txt = ''
      for (let j = 0; j < 12; j++)
        txt += chars[Math.floor(Math.random() * chars.length)] + '<br>'
      col.innerHTML = txt
      canvas.appendChild(col)
    }
  }, [])

  return (
    <div style={{ background: '#050d12', minHeight: '100vh', fontFamily: "'Share Tech Mono', monospace", color: '#00fff7', overflow: 'hidden' }}>

      <style>{`
        @keyframes fall { 0%{transform:translateY(-100%);opacity:1} 100%{transform:translateY(1000%);opacity:0} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:0.95} 93%{opacity:0.6} 94%{opacity:1} }
        .cp-cursor { display:inline-block; width:9px; height:16px; background:#00fff7; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
        .cp-btn-primary { background:transparent; border:1px solid #00fff7; color:#00fff7; padding:13px 32px; font-family:'Share Tech Mono',monospace; font-size:13px; letter-spacing:2px; cursor:pointer; transition:background 0.2s; }
        .cp-btn-primary:hover { background:#00fff720; }
        .cp-btn-secondary { background:transparent; border:1px solid #4af8; color:#4af; padding:13px 32px; font-family:'Share Tech Mono',monospace; font-size:13px; letter-spacing:2px; cursor:pointer; transition:background 0.2s; }
        .cp-btn-secondary:hover { background:#4af8; color:#050d12; }
        .cp-card { background:#070f18; border:1px solid #00fff722; padding:24px 20px; transition:border-color 0.2s; }
        .cp-card:hover { border-color:#00fff755; }
        .cp-dot { width:7px; height:7px; border-radius:50%; animation:blink 1.5s infinite; }
      `}</style>

      <div ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #00fff722' }}>
          <div style={{ fontSize: '17px', letterSpacing: '3px' }}>
            CODE_PATH<span className="cp-cursor" />
          </div>
          <div style={{ display: 'flex', gap: '28px' }}>
            {['ABOUT', 'PATHS', 'LEARN'].map(l => (
              <span key={l} style={{ color: '#4af', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer' }}>[ {l} ]</span>
            ))}
          </div>
        </nav>

        <div style={{ textAlign: 'center', padding: '72px 32px 48px' }}>
          <div style={{ color: '#00fff799', fontSize: '11px', letterSpacing: '4px', marginBottom: '20px' }}>
            &gt;&gt; FIND YOUR PROGRAMMING LANGUAGE
          </div>
          <div style={{ fontSize: '52px', letterSpacing: '5px', lineHeight: 1.1, marginBottom: '20px', animation: 'flicker 6s infinite', textShadow: '0 0 30px #00fff744' }}>
            WHAT WILL<br />YOU BUILD?
          </div>
          <div style={{ color: '#4af9', fontSize: '13px', letterSpacing: '1px', marginBottom: '40px', lineHeight: 1.9 }}>
            Answer 4 questions. Get your perfect language.<br />
            Then follow your personalized learning roadmap.
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cp-btn-primary" onClick={onStart}>[ START_QUIZ ]</button>
            <button className="cp-btn-secondary">[ VIEW_PATHS ]</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '56px', padding: '24px 32px', borderTop: '1px solid #00fff711', borderBottom: '1px solid #00fff711', margin: '0 48px' }}>
          {[['LANGUAGES', '04'], ['QUIZ_TIME', '2min'], ['ROADMAP_STEPS', '05'], ['COST', 'FREE']].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#4af7', fontSize: '10px', letterSpacing: '2px', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '20px' }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', color: '#4af7', fontSize: '11px', letterSpacing: '4px', margin: '40px 0 24px' }}>[ AVAILABLE PATHS ]</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', margin: '0 48px', background: '#00fff711' }}>
          {[
            { id: 'PATH_01 // web', name: 'JAVASCRIPT', desc: 'Build websites, apps & backends. Largest job market in tech.', status: 'RECOMMENDED', color: '#00fff7' },
            { id: 'PATH_02 // data', name: 'PYTHON', desc: 'AI, data science & automation. Most beginner-friendly language.', status: 'POPULAR', color: '#4af' },
            { id: 'PATH_03 // mobile', name: 'SWIFT', desc: 'Build iOS & macOS apps. Direct path to the App Store.', status: 'AVAILABLE', color: '#4af' },
            { id: 'PATH_04 // games', name: 'C# / UNITY', desc: 'Game development powerhouse. Used by indie & AAA studios.', status: 'AVAILABLE', color: '#4af' },
          ].map(p => (
            <div className="cp-card" key={p.name}>
              <div style={{ color: '#4af6', fontSize: '10px', letterSpacing: '2px', marginBottom: '12px' }}>{p.id}</div>
              <div style={{ color: '#00fff7', fontSize: '15px', letterSpacing: '1px', marginBottom: '10px' }}>{p.name}</div>
              <div style={{ color: '#4af9', fontSize: '11px', lineHeight: 1.8 }}>{p.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <div className="cp-dot" style={{ background: p.color }} />
                <span style={{ color: p.color + '88', fontSize: '10px', letterSpacing: '1px' }}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid #00fff711', marginTop: '48px' }}>
          <p style={{ color: '#4af5', fontSize: '11px', letterSpacing: '2px' }}>
            &gt;&gt; SELECT YOUR PATH. START YOUR JOURNEY. BUILD SOMETHING REAL.
          </p>
        </div>

      </div>
    </div>
  )
}