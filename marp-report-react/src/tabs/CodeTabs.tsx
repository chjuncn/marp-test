import React, { useMemo, useState } from 'react'

export const CodeTabs: React.FC<{ tabsJson: string }> = ({ tabsJson }: { tabsJson: string }) => {
  const tabs = useMemo(() => {
    try {
      return JSON.parse(tabsJson || '[]') as { title: string; code: string; lang?: string }[]
    } catch {
      return [] as any[]
    }
  }, [tabsJson])
  const [idx, setIdx] = useState(0)
  if (!tabs.length) return null
  return (
    <div className="code-tabs">
      <div className="tab-bar">
        {tabs.map((t, i) => (
          <button key={t.title} className={`tab ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} type="button">
            {t.title}
          </button>
        ))}
      </div>
      <div className="viewer">
        <pre className="raw"><code className="code-block">{tabs[idx].code}</code></pre>
      </div>
      <style>{`
        .tab-bar { display:flex; gap:.25rem; margin-bottom:.5rem }
        .tab { appearance:none; border-radius:9999px; padding:.4rem .9rem; background:#e2e8f0; font-weight:600 }
        .tab.active { background:#0ea5e9; color:#fff }
        .viewer { background:#eef2ff; border:1px solid #c7d2fe; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.06); padding:12px; overflow:auto }
        .raw { margin:0; padding:0; background:transparent; border:0 }
        .raw code.code-block { background:transparent !important; border:0 !important; box-shadow:none !important; }
      `}</style>
      <style>{`
        /* Hard reset any global typography code styling that might bleed in */
        .code-tabs pre.raw { background: transparent !important; border: none !important; }
        .code-tabs pre.raw code { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  )
}


