import React, { useMemo } from 'react'

type TableData = {
  caption?: string
  columns: string[]
  rows: Array<(string | number)[]>
  align?: Array<'left' | 'center' | 'right'>
}

export const TableVanilla: React.FC<{ json: string }> = ({ json }) => {
  const data: TableData = useMemo(() => {
    try {
      const parsed = JSON.parse(json || '{}')
      return parsed
    } catch {
      return { columns: [], rows: [] }
    }
  }, [json])

  if (!data.columns || !data.rows) return null

  const alignment = (idx: number): React.CSSProperties['textAlign'] => {
    const a = data.align?.[idx]
    if (a === 'center' || a === 'right' || a === 'left') return a
    return idx === 0 ? 'left' : 'right'
  }

  return (
    <figure className="tv-wrap">
      {data.caption && <figcaption className="tv-caption">{data.caption}</figcaption>}
      <div className="tv-scroll">
        <table className="tv-table">
          <thead>
            <tr>
              {data.columns.map((c, i) => (
                <th key={i} style={{ textAlign: alignment(i) }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((cell, ci) => (
                  <td key={ci} style={{ textAlign: alignment(ci) }}>{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .tv-wrap { margin: 1.5rem auto; }
        .tv-caption { text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .tv-scroll { overflow-x: auto; }
        .tv-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border-radius: 0.5rem; }
        .tv-table thead th { position: sticky; top: 0; background: #0ea5e9; color: #fff; font-weight: 700; padding: 0.75rem 1rem; }
        .tv-table tbody td { padding: 0.75rem 1rem; border-top: 1px solid #e5e7eb; }
        .tv-table tbody tr:nth-child(odd) td { background: #f8fafc; }
        .tv-table tbody tr:hover td { background: #eef2ff; }
        .tv-table th:first-child { border-top-left-radius: 0.5rem; }
        .tv-table th:last-child { border-top-right-radius: 0.5rem; }
      `}</style>
    </figure>
  )
}


