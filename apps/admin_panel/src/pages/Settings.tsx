import { useState } from 'react'

export default function Settings() {
  // Let's store toggle values in React state so they are fully interactive!
  const [settingsState, setSettingsState] = useState<Record<string, any>>({
    'Platform Name': 'Jibble',
    'Support Email': 'support@jibble.app',
    'Anonymous Posts (Circle)': true,
    'Stories': true,
    'Smart Matching': false,
    'Events': true,
    'Group Chats': true,
    'AI Content Filter': true,
    'Auto-ban on 5 reports': false
  })

  const handleToggle = (label: string) => {
    setSettingsState(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const handleInputChange = (label: string, value: string) => {
    setSettingsState(prev => ({
      ...prev,
      [label]: value
    }))
  }

  const groups = [
    {
      section: 'General',
      items: [
        { label: 'Platform Name', type: 'input' },
        { label: 'Support Email', type: 'input' },
      ],
    },
    {
      section: 'Feature Flags',
      items: [
        { label: 'Anonymous Posts (Circle)',   type: 'toggle' },
        { label: 'Stories',                    type: 'toggle' },
        { label: 'Smart Matching',             type: 'toggle' },
        { label: 'Events',                     type: 'toggle' },
        { label: 'Group Chats',                type: 'toggle' },
      ],
    },
    {
      section: 'Moderation',
      items: [
        { label: 'AI Content Filter',     type: 'toggle' },
        { label: 'Auto-ban on 5 reports', type: 'toggle' },
      ],
    },
  ]

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Configure platform-wide settings and feature flags.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {groups.map(group => (
          <div key={group.section} className="nm-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: 'var(--accent)' }}>{group.section}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {group.items.map((item, i) => {
                const isInput = item.type === 'input'
                const val = settingsState[item.label]
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                    
                    {isInput ? (
                      <input
                        value={String(val)}
                        onChange={(e) => handleInputChange(item.label, e.target.value)}
                        className="nm-input"
                        style={{ width: 280 }}
                      />
                    ) : (
                      /* Neumorphic Toggle Switch */
                      <div
                        onClick={() => handleToggle(item.label)}
                        style={{
                          width: 48,
                          height: 26,
                          background: val ? 'var(--accent)' : 'var(--bg-primary)',
                          borderRadius: 13,
                          cursor: 'pointer',
                          position: 'relative',
                          boxShadow: 'var(--nm-inset-sm)',
                          transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 4,
                          left: val ? 26 : 4,
                          width: 18,
                          height: 18,
                          background: '#ffffff',
                          borderRadius: '50%',
                          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '2px 2px 4px var(--shadow-dark), -1px -1px 2px var(--shadow-light)',
                        }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="nm-btn-accent" style={{ padding: '12px 36px', alignSelf: 'flex-start' }}>
        Save Changes
      </button>
    </div>
  )
}
