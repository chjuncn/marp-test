import { visit } from 'unist-util-visit'
import { ImageEditorSchema } from '../schemas'

export const imageEditor = () => () => async (tree: any) => {
  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if ((lang || '').trim() !== 'image_editor' || !parent || typeof index !== 'number') return

    try {
      const cfg = ImageEditorSchema.parse(JSON.parse(String(node.value || '{}')))
      parent.children.splice(index, 1, {
        type: 'raw',
        data: {
          hName: 'image-editor',
          hProperties: { 'data-src': cfg.src, 'data-width': String(cfg.width || '') },
        },
      })
    } catch {
      // keep as pre
    }
  })
}


