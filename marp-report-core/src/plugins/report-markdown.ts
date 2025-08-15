import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import { visit } from 'unist-util-visit'

// Support fenced blocks like:
// ```markdown:report
// # Heading
// Paragraph...
// ```
//
// This plugin parses the inner Markdown and inlines the resulting nodes
// into the current tree in place of the original code block.
export const reportMarkdown = () => () => async (tree: any) => {
  type Target = { parent: any; index: number; markdown: string }
  const targets: Target[] = []

  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    const langSub = lang ? (lang.split(':').pop() as string) : undefined

    if (langSub === 'report' && parent && typeof index === 'number')
      targets.push({ parent, index, markdown: String(node.value || '') })
  })

  if (!targets.length) return

  const childrenLists = await Promise.all(
    targets.map(async (t) => {
      const processor = unified().use(remarkParse).use(remarkGfm).use(remarkSlug)
      const root = await processor.run(processor.parse(t.markdown))
      const cleaned = removePosition(root, true)
      return (cleaned as any).children as any[]
    })
  )

  for (let i = targets.length - 1; i >= 0; i -= 1) {
    const { parent, index } = targets[i]
    const children = childrenLists[i]
    parent.children.splice(index, 1, ...children)
  }
}


