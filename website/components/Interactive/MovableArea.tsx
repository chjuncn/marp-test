import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'

export type MovableItem = {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  content?: string
}

export type MovableAreaProps = {
  width?: number
  height?: number
  items: MovableItem[]
}

export const MovableArea: React.FC<MovableAreaProps> = ({ width = 600, height = 300, items }) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(items.map((i) => [i.id, { x: i.x, y: i.y }]))
  )
  const dragging = useRef<
    { id: string; offsetX: number; offsetY: number; w: number; h: number } | null
  >(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const handleDown = useCallback((e: React.MouseEvent, id: string) => {
    const target = e.currentTarget as HTMLDivElement
    const rect = target.getBoundingClientRect()
    dragging.current = {
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    }
  }, [])

  const handleUp = useCallback(() => {
    dragging.current = null
  }, [])

  const handleMove = useCallback((e: MouseEvent) => {
    const drag = dragging.current
    const area = areaRef.current
    if (!drag || !area) return
    const areaRect = area.getBoundingClientRect()
    const maxX = Math.max(areaRect.width - drag.w, 0)
    const maxY = Math.max(areaRect.height - drag.h, 0)
    const rawX = e.clientX - areaRect.left - drag.offsetX
    const rawY = e.clientY - areaRect.top - drag.offsetY
    const nextX = Math.max(0, Math.min(rawX, maxX))
    const nextY = Math.max(0, Math.min(rawY, maxY))
    const id = drag.id
    setPositions((prev) => ({ ...prev, [id]: { x: nextX, y: nextY } }))
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleMove(e)
    const onUp = () => handleUp()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [handleMove, handleUp])

  const itemStyle = useMemo(() => ({ position: 'absolute' as const, cursor: 'grab' }), [])

  return (
    <div
      ref={areaRef}
      className={classNames('movable-area border')}
      style={{ position: 'relative', width, height, overflow: 'hidden' }}
    >
      {items.map((i) => (
        <div
          key={i.id}
          onMouseDown={(e) => handleDown(e, i.id)}
          style={{
            ...itemStyle,
            left: positions[i.id]?.x ?? i.x,
            top: positions[i.id]?.y ?? i.y,
            width: i.w ?? 80,
            height: i.h ?? 40,
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          <span style={{ padding: 8 }}>{i.content ?? i.id}</span>
        </div>
      ))}
    </div>
  )
}


