import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import { visit } from 'unist-util-visit'
import { imageParagraphToFigure } from './image-paragraph-to-figure'
import { marpCodeBlock } from './marp-code-block'

type ReportTarget = {
  parent: any
  index: number
  markdown: string
}

// Detect fenced code blocks that end with ":report" (e.g. ```markdown:report)
// Parse the inner Markdown into MDAST and inline it into the tree (no custom element).
export const reportCodeBlock = () => async (tree) => {
  const targets: ReportTarget[] = []

  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    const langSub = lang ? lang.split(':').pop() : undefined

    if (langSub === 'report' && parent && typeof index === 'number') {
      targets.push({ parent, index, markdown: String(node.value || '') })
    }
  })

  const parsedChildrenList = await Promise.all(
    targets.map(async (t) => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkSlug)
        .use(imageParagraphToFigure)
        .use([marpCodeBlock])

      const root = await processor.run(processor.parse(t.markdown))
      const cleaned = removePosition(root, true)
      return (cleaned as any).children as any[]
    })
  )

  // Splice parsed children into original tree, from last to first to keep indices stable
  for (let i = targets.length - 1; i >= 0; i -= 1) {
    const { parent, index } = targets[i]
    const children = parsedChildrenList[i]
    parent.children.splice(index, 1, ...children)
  }
}


