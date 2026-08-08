import { useState } from 'react'
import { useTeamTaskStore, Policy } from '../store/useTeamTaskStore'

export default function PrivacyPolicy() {
  const { policies, privacySettings, addPolicy, togglePolicyMandatory, updatePrivacySettings } = useTeamTaskStore()

  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [policySearch, setPolicySearch] = useState<string>('')
  const [showPolicyModal, setShowPolicyModal] = useState(false)

  // New Policy Form State
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<Policy['category']>('Data Privacy')
  const [newVersion, setNewVersion] = useState('v1.0')
  const [newEffectiveDate, setNewEffectiveDate] = useState('Immediate')
  const [newMandatory, setNewMandatory] = useState(true)
  const [newContent, setNewContent] = useState('')

  // Metrics
  const totalPolicies = policies.length
  const mandatoryPolicies = policies.filter(p => p.isMandatory).length
  const avgCompliance = Math.round(policies.reduce((acc, p) => acc + p.complianceRate, 0) / (totalPolicies || 1))

  // Filtered policies
  const filteredPolicies = policies.filter((p) => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter
    const matchSearch =
      p.title.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(policySearch.toLowerCase()) ||
      (p.content ?? '').toLowerCase().includes(policySearch.toLowerCase())
    return matchCat && matchSearch
  })

  const handleCreatePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newContent) return
    addPolicy({
      title: newTitle,
      category: newCategory,
      version: newVersion || 'v1.0',
      effectiveDate: newEffectiveDate || 'Immediate',
      isMandatory: newMandatory,
      complianceRate: 100,
      content: newContent
    })
    setNewTitle('')
    setNewContent('')
    setShowPolicyModal(false)
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Privacy & Policy Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Manage corporate privacy policies, employee compliance sign-offs, GDPR data controls, and workplace governance.
          </p>
        </div>

        <button
          type="button"
          className="nm-btn-accent"
          style={{ padding: '10px 20px', fontSize: '13px' }}
          onClick={() => setShowPolicyModal(true)}
        >
          + Add New Policy Document
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(51,102,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🛡️
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Policies</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalPolicies} ({mandatoryPolicies} Mandatory)</h3>
          </div>
        </div>

        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            📊
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Avg Employee Compliance</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{avgCompliance}% Signed</h3>
          </div>
        </div>

        <div className="nm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🔐
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>GDPR Data Mode</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: privacySettings.gdprCompliant ? '#059669' : 'var(--danger)' }}>
              {privacySettings.gdprCompliant ? 'ACTIVE ✓' : 'INACTIVE ✕'}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Policies List, Right Privacy Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Column: Policies Repository */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Toolbar */}
          <div className="nm-card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                className="nm-input-glass"
                placeholder="Search policy document..."
                value={policySearch}
                onChange={(e) => setPolicySearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'Data Privacy', 'Security', 'Code of Conduct', 'Remote Work'].map((cat) => {
                const isActive = categoryFilter === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: isActive ? 'var(--accent)' : 'rgba(243,239,232,0.4)',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      boxShadow: isActive ? 'var(--nm-inset-sm)' : 'var(--nm-flat-xs)'
                    }}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Policy Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredPolicies.map((pol) => (
              <div key={pol.id} className="nm-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(51,102,89,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                        {pol.category}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{pol.version}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{pol.title}</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: pol.isMandatory ? 'rgba(180, 74, 74, 0.12)' : 'rgba(243, 239, 232, 0.5)',
                        color: pol.isMandatory ? 'var(--danger)' : 'var(--text-muted)'
                      }}
                      onClick={() => togglePolicyMandatory(pol.id)}
                    >
                      {pol.isMandatory ? '🚨 Mandatory Sign-off' : '⚪ Optional Document'}
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {pol.content}
                </p>

                {/* Progress bar footer */}
                <div className="nm-card-inset" style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Employee Acceptance Rate</span>
                      <span style={{ color: 'var(--accent)' }}>{pol.complianceRate}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${pol.complianceRate}%`, height: '100%', background: 'var(--accent)', borderRadius: '3px' }} />
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Effective: {pol.effectiveDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Privacy Controls & Governance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="nm-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚙️ Privacy & Data Controls
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Configure global data protection rules, employee data masking, and audit logging settings.
            </p>

            {/* Controls Switches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>GDPR Compliance Mode</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enforce user data privacy rules</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.gdprCompliant}
                  onChange={(e) => updatePrivacySettings({ gdprCompliant: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>PII Data Masking</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mask phone & email in logs</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.piiMaskingEnabled}
                  onChange={(e) => updatePrivacySettings({ piiMaskingEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Audit Trail Logging</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Record admin access actions</div>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.auditLoggingEnabled}
                  onChange={(e) => updatePrivacySettings({ auditLoggingEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div className="nm-card-inset" style={{ padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Employee Data Retention Period</div>
                <select
                  className="nm-input-glass"
                  style={{ fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  value={privacySettings.dataRetentionMonths}
                  onChange={(e) => updatePrivacySettings({ dataRetentionMonths: parseInt(e.target.value) })}
                >
                  <option value={6}>6 Months Schedule</option>
                  <option value={12}>12 Months (1 Year Standard)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={60}>60 Months (5 Years Corporate)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CREATE POLICY MODAL ================= */}
      {showPolicyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="spatial-panel animate-pop-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Add New Policy Document</h3>
              <button type="button" style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowPolicyModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreatePolicySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Policy Title</label>
                <input type="text" className="nm-input-glass" placeholder="e.g. Workplace AI Use & Ethics Guidelines" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select className="nm-input-glass" value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}>
                    <option value="Data Privacy">Data Privacy</option>
                    <option value="Security">Security</option>
                    <option value="Code of Conduct">Code of Conduct</option>
                    <option value="Remote Work">Remote Work</option>
                    <option value="Access Control">Access Control</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Version Number</label>
                  <input type="text" className="nm-input-glass" value={newVersion} onChange={(e) => setNewVersion(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="mand-check" checked={newMandatory} onChange={(e) => setNewMandatory(e.target.checked)} style={{ cursor: 'pointer' }} />
                <label htmlFor="mand-check" style={{ fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Mandatory Sign-off for All Employees</label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Policy Description / Content</label>
                <textarea className="nm-input-glass" rows={4} placeholder="Outline the guidelines, compliance rules, and employee responsibilities..." value={newContent} onChange={(e) => setNewContent(e.target.value)} required />
              </div>

              <button type="submit" className="nm-btn-accent" style={{ marginTop: '10px', padding: '12px' }}>
                Publish Policy Document 🛡️
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
