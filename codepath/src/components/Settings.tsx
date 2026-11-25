import { useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import { themes } from '../lib/themes'
import { supabase } from '../lib/supabase'
import { resolvePath } from '../data/languages'

type User = {
  username: string
  email: string
  language: string
  avatar_url?: string
}

type Props = {
  user: User
  onBack: () => void
  onRetakeQuiz: () => void
  onDeleteAccount: () => void
  onUserUpdate: (user: User) => void
  onLogout: () => void
}

export default function Settings({ user, onBack, onRetakeQuiz, onDeleteAccount, onUserUpdate, onLogout }: Props) {
  const { theme, setThemeId, themeId } = useTheme()
  const [activeSection, setActiveSection] = useState('profile')
  const [newUsername, setNewUsername] = useState(user.username)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleSaveUsername() {
    if (!newUsername.trim()) return
    setSaving(true)
    const trimmed = newUsername.trim()
    const { error } = await supabase
      .from('users')
      .update({ username: trimmed })
      .eq('email', user.email)
    setSaving(false)
    if (!error) onUserUpdate({ ...user, username: trimmed })
    setSaveMsg(error ? '[ ERROR ] Could not save.' : '[ SAVED ]')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.email}_${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      const url = urlData.publicUrl
      await supabase.from('users').update({ avatar_url: url }).eq('email', user.email)
      setAvatarUrl(url)
      onUserUpdate({ ...user, avatar_url: url })
    }
    setUploading(false)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError('')
    // Deletes go through a database function: the users table has no DELETE policy,
    // so a direct .delete() is silently blocked by row level security.
    const { data: deleted, error } = await supabase.rpc('delete_account', { p_email: user.email })
    setDeleting(false)
    if (error || !deleted) {
      setDeleteError('[ ERROR ] Could not delete your account. Try again.')
      return
    }
    onDeleteAccount()
  }

  const t = theme

  const sections = [
    { id: 'profile', label: '[ PROFILE ]' },
    { id: 'path', label: '[ MY PATH ]' },
    { id: 'appearance', label: '[ APPEARANCE ]' },
    { id: 'danger', label: '[ DANGER ZONE ]' },
  ]

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: t.font, display: 'flex' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cp-cursor { display:inline-block; width:9px; height:16px; background:${t.primary}; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
        .cp-input { width:100%; background:${t.bgSecondary}; border:1px solid ${t.border}; color:${t.primary}; padding:12px 16px; font-family:${t.font}; font-size:13px; outline:none; letter-spacing:1px; box-sizing:border-box; }
        .cp-input:focus { border-color:${t.primary}; }
        .theme-card { border:1px solid ${t.border}; padding:20px; cursor:pointer; transition:all 0.2s; }
        .theme-card:hover { border-color:${t.borderSecondary}; }
        .theme-card.active { border-color:${t.primary}; }
        .section-btn { background:transparent; border:none; padding:12px 20px; font-family:${t.font}; font-size:11px; letter-spacing:2px; cursor:pointer; text-align:left; width:100%; transition:background 0.2s; }
        .section-btn:hover { background:${t.border}; }
        .section-btn.active { color:${t.primary}; border-left:2px solid ${t.primary}; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: '220px', background: t.bgTertiary, borderRight: `1px solid ${t.border}`, padding: '32px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px', marginBottom: '32px' }}>
          <div style={{ color: t.primary, fontSize: '16px', letterSpacing: '3px' }}>
            SETTINGS<span className="cp-cursor" />
          </div>
        </div>
        {sections.map(s => (
          <button
            key={s.id}
            className={`section-btn ${activeSection === s.id ? 'active' : ''}`}
            style={{ color: activeSection === s.id ? t.primary : t.secondary }}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onBack}
            style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.secondary, padding: '10px 20px', fontFamily: t.font, fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', width: '100%' }}
          >
            [ BACK ]
          </button>
          <button
            onClick={onLogout}
            style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '10px 20px', fontFamily: t.font, fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', width: '100%' }}
          >
            [ LOGOUT ]
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>

        {/* PROFILE */}
        {activeSection === 'profile' && (
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; PROFILE</div>
            <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>Your Identity</div>

            <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: t.bgSecondary, border: `2px solid ${t.borderSecondary}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary, fontSize: '28px', flexShrink: 0 }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user.username[0].toUpperCase()
                  )}
                </div>
                <div>
                  <label style={{ cursor: 'pointer' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                    <div style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '10px 20px', fontSize: '11px', letterSpacing: '2px', fontFamily: t.font, cursor: 'pointer' }}>
                      {uploading ? 'UPLOADING...' : '[ CHANGE PHOTO ]'}
                    </div>
                  </label>
                  <div style={{ color: t.secondary, fontSize: '10px', marginTop: '6px' }}>JPG, PNG — max 2MB</div>
                </div>
              </div>

              <div>
                <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>USERNAME</div>
                <input className="cp-input" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
              </div>
              <div>
                <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</div>
                <div style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, color: t.secondary, padding: '12px 16px', fontSize: '13px' }}>
                  {user.email}
                </div>
                <div style={{ color: t.secondary, fontSize: '10px', marginTop: '4px' }}>Email cannot be changed</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={handleSaveUsername}
                  disabled={saving}
                  style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '12px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}
                >
                  {saving ? 'SAVING...' : '[ SAVE_CHANGES ]'}
                </button>
                {saveMsg && <span style={{ color: t.primary, fontSize: '12px', letterSpacing: '1px' }}>{saveMsg}</span>}
              </div>
            </div>
          </div>
        )}

        {/* MY PATH */}
        {activeSection === 'path' && (
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; MY PATH</div>
            <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>Your Path</div>

            <div style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '24px', maxWidth: '480px', marginBottom: '24px' }}>
              <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>ASSIGNED PATH</div>
              <div style={{ color: t.primary, fontSize: '28px', letterSpacing: '2px' }}>{resolvePath(user.language).field}</div>
              <div style={{ color: t.secondary, fontSize: '11px', letterSpacing: '2px', marginTop: '8px' }}>FIRST LANGUAGE: {resolvePath(user.language).firstLanguage}</div>
            </div>

            <div style={{ color: t.secondary, fontSize: '12px', lineHeight: 1.8, marginBottom: '24px', maxWidth: '480px' }}>
              Want a different path? You can talk to EduBot again. Your progress on each path is saved, so you can switch back anytime.
            </div>

            <button
              onClick={onRetakeQuiz}
              style={{ background: 'transparent', border: `1px solid ${t.secondary}`, color: t.secondary, padding: '12px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
            >
              [ RETAKE_QUIZ ]
            </button>
          </div>
        )}

        {/* APPEARANCE */}
        {activeSection === 'appearance' && (
          <div>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; APPEARANCE</div>
            <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>Choose Your Theme</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '600px' }}>
              {Object.values(themes).map(th => (
                <div
                  key={th.id}
                  className={`theme-card ${themeId === th.id ? 'active' : ''}`}
                  style={{ background: th.bg, borderColor: themeId === th.id ? th.primary : th.border }}
                  onClick={() => setThemeId(th.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ color: th.primary, fontSize: '13px', letterSpacing: '2px', fontFamily: th.font }}>{th.name}</div>
                    {themeId === th.id && (
                      <div style={{ color: th.primary, fontSize: '10px', border: `1px solid ${th.primary}`, padding: '2px 8px' }}>ACTIVE</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: th.primary, borderRadius: '4px' }} />
                    <div style={{ width: '24px', height: '24px', background: th.secondary, borderRadius: '4px' }} />
                    <div style={{ width: '24px', height: '24px', background: th.bgSecondary, border: `1px solid ${th.border}`, borderRadius: '4px' }} />
                  </div>
                  <div style={{ marginTop: '12px', background: th.bgSecondary, border: `1px solid ${th.border}`, padding: '8px 12px' }}>
                    <div style={{ color: th.primary, fontSize: '10px', fontFamily: th.font }}>&gt;&gt; preview_text</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DANGER ZONE */}
        {activeSection === 'danger' && (
          <div>
            <div style={{ color: '#ff4444', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; DANGER ZONE</div>
            <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '32px' }}>Irreversible Actions</div>

            <div style={{ background: '#1a0505', border: '1px solid #ff444433', padding: '24px', maxWidth: '480px' }}>
              <div style={{ color: '#ff4444', fontSize: '13px', letterSpacing: '1px', marginBottom: '8px' }}>DELETE ACCOUNT</div>
              <div style={{ color: '#ff444488', fontSize: '12px', lineHeight: 1.8, marginBottom: '20px' }}>
                This will permanently delete your account and all progress. This cannot be undone.
              </div>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
                >
                  [ DELETE_ACCOUNT ]
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    style={{ background: '#ff444422', border: '1px solid #ff4444', color: '#ff4444', padding: '12px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
                  >
                    {deleting ? 'DELETING...' : '[ CONFIRM_DELETE ]'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.secondary, padding: '12px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
                  >
                    [ CANCEL ]
                  </button>
                </div>
              )}
              {deleteError && (
                <div style={{ color: '#ff4444', fontSize: '12px', letterSpacing: '1px', marginTop: '16px' }}>{deleteError}</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}