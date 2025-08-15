import React, { FunctionComponent, createElement } from 'react'
import { MovableBlock } from './movable/MovableBlock'
import { ImageEditor } from './image/ImageEditor'
import { TableVanilla } from './table/TableVanilla'
import { CodeTabs } from './tabs/CodeTabs'

const safeJsonParse = (jsonStr: string, fallback: any = {}) => {
  try {
    return JSON.parse(jsonStr || '{}')
  } catch {
    return fallback
  }
}

// Ensure client-side only operations are properly isolated
const isClientSide = () => typeof window !== 'undefined'

export const registry: Record<string, FunctionComponent<any>> = {
  'movable-block': (props: any) => createElement(MovableBlock as any, { json: props['data-json'] }),
  'image-editor': (props: any) => {
    const jsonData = safeJsonParse(props['data-json'])
    return createElement(ImageEditor as any, {
      src: props['data-src'] ?? jsonData.src ?? '',
      width: Number(props['data-width'] || jsonData.width || 640),
    })
  },
  'table-vanilla': (props: any) => createElement(TableVanilla as any, { json: props['data-json'] }),
  'code-tabs': (props: any) => createElement(CodeTabs as any, { tabsJson: props['data-tabs'] }),
}


