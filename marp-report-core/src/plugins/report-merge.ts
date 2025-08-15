import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import { visit } from 'unist-util-visit'
import matter from 'gray-matter'

// Consumer should pass a loader to resolve markdown by id/path.
// NOTE: This should only be used server-side during build/SSR as it requires file system access.
export type MarkdownLoader = (id: string) => string | undefined | Promise<string | undefined>

export const substituteVariables = (template: string, data: any): string =>
  template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_m, key: string) => {
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

// ```report-merge\n template: file-a.md\n data: file-b.md\n```
export const reportMerge = (load: MarkdownLoader) => () => async (tree: any) => {
  type Target = { parent: any; index: number; template: string; data: string }
  const targets: Target[] = []

  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if (lang !== 'report-merge' || !parent || typeof index !== 'number') return

    const lines = String(node.value || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    const entries = Object.fromEntries(
      lines
        .map((l) => l.match(/^([\w.-]+)\s*:\s*(.+)$/))
        .filter(Boolean)
        .map((m) => [m![1], m![2]])
    ) as { template?: string; data?: string }

    if (entries.template && entries.data)
      targets.push({ parent, index, template: entries.template, data: entries.data })
  })

  for (let i = targets.length - 1; i >= 0; i -= 1) {
    const { parent, index, template, data } = targets[i]
    const templateMd = await load(template)
    const dataMd = await load(data)
    const merged = substituteVariables(templateMd || '', matter(dataMd || '').data || {})
    const content = matter(merged).content

    const processor = unified().use(remarkParse).use(remarkGfm).use(remarkSlug)
    const root = await processor.run(processor.parse(content))
    const cleaned = removePosition(root, true)
    parent.children.splice(index, 1, ...(cleaned as any).children)
  }
}


