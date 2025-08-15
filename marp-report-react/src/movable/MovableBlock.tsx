import React, { useMemo } from 'react'
import { MovableArea } from './MovableArea'

export const MovableBlock: React.FC<{ json: string }> = ({ json }: { json: string }) => {
  const cfg = useMemo(() => {
    try {
      return JSON.parse(json || '{}')
    } catch {
      return { width: 600, height: 300, items: [] }
    }
  }, [json])

  return <MovableArea width={cfg.width} height={cfg.height} items={cfg.items || []} />
}


