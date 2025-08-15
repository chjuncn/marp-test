import React, { useMemo, useState } from 'react'
import { CodeBlock } from 'components/CodeBlock'

type Tab = { title: string; code: string; lang?: string }

export const CodeTabs: React.FC<{ tabsJson: string }> = ({ tabsJson }) => {
  const tabs: Tab[] = useMemo(() => {
    try {
      return JSON.parse(tabsJson || '[]')
    } catch {
      return []
    }
  }, [tabsJson])

  const [idx, setIdx] = useState(0)
  if (!tabs.length) return null

  return (
    <div className="code-tabs">
      <div className="tab-bar">
        {tabs.map((t, i) => (
          <button
            key={t.title}
            className={`tab ${i === idx ? 'active' : ''}`}
            onClick={() => setIdx(i)}
            type="button"
          >
            {t.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <CodeBlock language={tabs[idx].lang || 'markdown'} copyButton>
          {tabs[idx].code}
        </CodeBlock>
      </div>
      <style jsx>{`
        .code-tabs { margin: 1.5rem 0; }
        .tab-bar { display: flex; gap: 0.25rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .tab { appearance: none; border-radius: 9999px; padding: 0.4rem 0.9rem; background: #e2e8f0; font-weight: 600; }
        .tab.active { background: #0ea5e9; color: #fff; }
        .tab-content :global(pre) { margin: 0; }
      `}</style>
    </div>
  )
}


