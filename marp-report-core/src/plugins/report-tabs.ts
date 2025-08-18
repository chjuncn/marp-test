import { visit } from 'unist-util-visit'

// NOTE: This should only be used server-side during build/SSR as it requires file system access.
export type MarkdownLoader = (id: string) => string | undefined | Promise<string | undefined>

// ```report-tabs\nfile-a.md\nfile-b.md\n```
export const reportTabs = (load: MarkdownLoader) => () => async (tree: any) => {
  type Target = { parent: any; index: number; files: string[] }
  const targets: Target[] = []

  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if (lang !== 'report-tabs' || !parent || typeof index !== 'number') return

    const files = String(node.value || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (files.length > 0) {
      targets.push({ parent, index, files })
    }
  })

  // Process all targets asynchronously
  for (let i = targets.length - 1; i >= 0; i -= 1) {
    const { parent, index, files } = targets[i]

    const tabs = await Promise.all(
      files.map(async (file) => ({
        title: file,
        code: (load ? await load(file) : undefined) ?? '',
        lang: 'markdown',
      }))
    )

    parent.children.splice(index, 1, {
      type: 'raw',
      data: { hName: 'code-tabs', hProperties: { 'data-tabs': JSON.stringify(tabs) } },
    })
  }
}


