import { visit } from 'unist-util-visit'
import { TableVanillaSchema } from '../schemas'

export const tableVanilla = () => () => async (tree: any) => {
  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if ((lang || '').trim() !== 'table_theme_vanilla' || !parent || typeof index !== 'number') return

    try {
      const cfg = TableVanillaSchema.parse(JSON.parse(String(node.value || '{}')))
      parent.children.splice(index, 1, {
        type: 'raw',
        data: { hName: 'table-vanilla', hProperties: { 'data-json': JSON.stringify(cfg) } },
      })
    } catch {
      // keep as pre
    }
  })
}


