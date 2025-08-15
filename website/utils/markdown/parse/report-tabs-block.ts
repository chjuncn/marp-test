import { visit } from 'unist-util-visit'

const BLOG_CTX = () => require.context('blog', false, /\.md$/)

const loadBlogMarkdown = (pathOrSlug: string): string | undefined => {
  try {
    const normalized = pathOrSlug.replace(/^blog\//, '').replace(/^\.\//, '')
    const key = `./${normalized.endsWith('.md') ? normalized : `${normalized}.md`}`
    const mod = BLOG_CTX()(key)
    return typeof mod === 'string' ? (mod as string) : ((mod as any).default as string)
  } catch {
    return undefined
  }
}

// ```report-tabs\nfile-a.md\nfile-b.md\n```
// Turns into <code-tabs data-tabs="[{title, code, lang}]"/>
export const reportTabsBlock = () => async (tree) => {
  visit(tree, 'code', (node: any, index: number | null, parent: any | null) => {
    const lang: string | undefined = node.lang as string | undefined
    if (lang !== 'report-tabs' || !parent || typeof index !== 'number') return

    const files = String(node.value || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    const tabs = files
      .map((file) => ({
        title: file,
        code: loadBlogMarkdown(file) ?? `<!-- Could not load ${file} -->`,
        lang: 'markdown',
      }))
      .filter(Boolean)

    parent.children.splice(index, 1, {
      type: 'raw',
      data: { hName: 'code-tabs', hProperties: { 'data-tabs': JSON.stringify(tabs) } },
    })
  })
}


