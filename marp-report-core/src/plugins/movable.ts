import { visit } from 'unist-util-visit'
import { MovableSchema } from '../schemas'

export const movable = () => () => async (tree: any) => {
  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if ((lang || '').trim() !== 'movable' || !parent || typeof index !== 'number') return

    try {
      const parsed = MovableSchema.parse(JSON.parse(String(node.value || '{}')))
      parent.children.splice(index, 1, {
        type: 'raw',
        data: { hName: 'movable-block', hProperties: { 'data-json': JSON.stringify(parsed) } },
      })
    } catch {
      // keep as pre
    }
  })
}


