import React from 'react'
import { MovableArea, MovableItem } from './MovableArea'

export const MovableBlock: React.FC<{ json: string }> = ({ json }) => {
  let data: { width?: number; height?: number; items?: MovableItem[] } = {}
  try {
    data = JSON.parse(json)
  } catch {
    // ignore
  }
  const { width = 600, height = 300, items = [] } = data || {}
  return <MovableArea width={width} height={height} items={items} />
}


