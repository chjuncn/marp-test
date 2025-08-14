import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import { visit } from 'unist-util-visit'
import { imageParagraphToFigure } from './image-paragraph-to-figure'
import { marpCodeBlock } from './marp-code-block'
import { parseMatter as parseGrayMatter } from 'utils/markdown'

const BLOG_CTX = () => require.context('blog', false, /\.md$/)

const loadBlogMarkdown = (pathOrSlug: string): string => {
  const normalized = pathOrSlug.replace(/^blog\//, '').replace(/^\.\//, '')
  const key = `./${normalized.endsWith('.md') ? normalized : `${normalized}.md`}`
  const mod = BLOG_CTX()(key)
  // In this repo, ctx(id) returns a string directly (not a module with default)
  return typeof mod === 'string' ? (mod as string) : ((mod as any).default as string)
}

const substituteVariables = (template: string, data: any): string => {
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_m, key: string) => {
    const parts = key.split('.')
    let cur: any = data
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
      else return ''
    }
    if (cur === null || cur === undefined) return ''
    if (typeof cur === 'object') return JSON.stringify(cur)
    return String(cur)
  })
}

// ```report-merge\n template: template-report.md\n data: data-report.md\n```
export const reportMergeBlock = () => async (tree) => {
  const targets: Array<{ parent: any; index: number; value: string }> = []

  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if (lang === 'report-merge' && parent && typeof index === 'number')
      targets.push({ parent, index, value: String(node.value || '') })
  })

  for (let i = targets.length - 1; i >= 0; i -= 1) {
    const { parent, index, value } = targets[i]

    const lines = value
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    const entries = Object.fromEntries(
      lines
        .map((l) => l.match(/^([\w.-]+)\s*:\s*(.+)$/))
        .filter(Boolean)
        .map((m) => [m![1], m![2]])
    ) as { template?: string; data?: string }

    if (!entries.template || !entries.data) {
      // Remove the block if misconfigured
      parent.children.splice(index, 1)
      continue
    }

    const templateMd = loadBlogMarkdown(entries.template)
    const dataMd = loadBlogMarkdown(entries.data)

    const dataMatter = parseGrayMatter(dataMd)
    const mergedTemplate = substituteVariables(templateMd, dataMatter.data || {})
    const mergedMatter = parseGrayMatter(mergedTemplate)
    const mergedRaw = mergedMatter.content

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkSlug)
      .use(imageParagraphToFigure)
      .use([marpCodeBlock])

    const root = await processor.run(processor.parse(mergedRaw))
    const cleaned = removePosition(root, true)
    const children = (cleaned as any).children as any[]

    parent.children.splice(index, 1, ...children)
  }
}


