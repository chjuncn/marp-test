// Main exports for the marp-report-cli library
export { convertMarkdownToReport, extractReportElements } from './converter.js'
export { generateHtml } from './generators/html.js'
export { generateJson, generateJsonSchema } from './generators/json.js'
export type { ConvertOptions, ReportData } from './converter.js'
export type { HtmlGeneratorOptions } from './generators/html.js'
export type { JsonOutputOptions } from './generators/json.js'

// Re-export some useful types from marp-report-core
export type { MarkdownLoader } from 'marp-report-core'

// Helper utilities for React integration
export const COMPONENT_REGISTRY_NAMES = {
  MOVABLE_BLOCK: 'movable-block',
  IMAGE_EDITOR: 'image-editor',
  TABLE_VANILLA: 'table-vanilla',
  CODE_TABS: 'code-tabs'
} as const

export function extractReactComponents(reportData: import('./converter.js').ReportData): Array<{type: string, props: any}> {
  const components: Array<{type: string, props: any}> = []

  function traverse(node: any) {
    if (node.type === 'raw' && node.data?.hName) {
      components.push({
        type: node.data.hName,
        props: node.data.hProperties || {}
      })
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  if (reportData.content) {
    traverse(reportData.content)
  }

  return components
}
