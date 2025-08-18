import { unified } from 'unified'
import { Marp } from '@marp-team/marp-core'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import grayMatter from 'gray-matter'
import {
  reportMerge,
  reportTabs,
  reportMarkdown,
  movable,
  imageEditor,
  tableVanilla,
  type MarkdownLoader
} from 'marp-report-core'

export interface ConvertOptions {
  filename?: string
  verbose?: boolean
  customPlugins?: any[]
}

export interface ReportData {
  frontmatter: Record<string, any>
  content: any // AST
  metadata: {
    filename?: string
    generatedAt: string
    version: string
  }
}

// Simple markdown loader for CLI usage
const markdownLoader: MarkdownLoader = async (path: string) => {
  // For CLI, we'll handle relative imports differently
  // This is a basic implementation - you might want to enhance it
  const fs = await import('fs-extra')
  const pathModule = await import('path')

  try {
    // Resolve relative to current working directory
    const resolvedPath = pathModule.resolve(process.cwd(), path)
    const content = await fs.default.readFile(resolvedPath, 'utf-8')
    return content
  } catch (error) {
    console.warn(`Warning: Could not load markdown file: ${path}`)
    return ''
  }
}

export async function convertMarkdownToReport(
  markdownContent: string,
  options: ConvertOptions = {}
): Promise<ReportData> {
  const { filename, verbose = false, customPlugins = [] } = options

  if (verbose) {
    console.log('🔍 Parsing frontmatter...')
  }

  // Parse frontmatter
  const { data: frontmatter, content } = grayMatter(markdownContent)

  if (verbose) {
    console.log('🔧 Setting up processor with plugins...')
  }

  // Create unified processor with marp-report plugins
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSlug)
    .use(reportMarkdown() as any)
    .use(reportMerge(markdownLoader) as any)
    .use(reportTabs(markdownLoader) as any)
    // Render fenced ```markdown:marp as Marp slides
    .use((() => () => async (tree: any) => {
      const targets: Array<{ parent: any; index: number; markdown: string }> = []
      const { visit } = await import('unist-util-visit')
      visit(tree as any, 'code', (node: any, index: number | null, parent: any | null) => {
        const lang: string | undefined = node.lang as string | undefined
        if (lang === 'markdown:marp' && parent && typeof index === 'number') {
          targets.push({ parent, index, markdown: String(node.value || '') })
        }
      })

      if (!targets.length) return

      const marp = new Marp({ html: true, minifyCSS: true })

      for (let i = targets.length - 1; i >= 0; i -= 1) {
        const { parent, index, markdown } = targets[i]
        const { html, css } = marp.render(markdown)
        const compiled = `<style>${css}</style>${html}`
        parent.children.splice(index, 1, {
          type: 'raw',
          data: {
            hName: 'marp-slides',
            hProperties: { 'data-html': compiled },
          },
        })
      }
    })() as any)
    .use(movable() as any)
    .use(imageEditor() as any)
    .use(tableVanilla() as any)

  // Add any custom plugins
  for (const plugin of customPlugins) {
    processor.use(plugin)
  }

  if (verbose) {
    console.log('📝 Processing markdown content...')
  }

  // Parse and transform the markdown content
  const ast = processor.parse(content)
  const transformedAst = await processor.run(ast)

  if (verbose) {
    console.log('✅ Conversion completed')
  }

  return {
    frontmatter,
    content: transformedAst,
    metadata: {
      filename,
      generatedAt: new Date().toISOString(),
      version: '0.1.0'
    }
  }
}

export function extractReportElements(reportData: ReportData) {
  // Helper function to extract specific report elements
  // This can be useful for generating different output formats
  const elements = {
    movableBlocks: [],
    imageEditors: [],
    codeTabs: [],
    tables: [],
    mergedContent: []
  }

  // Traverse the AST to collect elements
  // Implementation depends on your AST structure
  // This is a placeholder for the extraction logic

  return elements
}
