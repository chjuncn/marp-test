import React from 'react'
import { registry } from 'marp-report-react'

interface ASTNode {
  type: string
  children?: ASTNode[]
  value?: string
  depth?: number
  ordered?: boolean
  lang?: string
  url?: string
  alt?: string
  title?: string
  data?: {
    hName?: string
    hProperties?: Record<string, any>
    id?: string
  }
  position?: any
}

interface ReportRendererProps {
  ast: ASTNode
}

export const ReportRenderer: React.FC<ReportRendererProps> = ({ ast }) => {
  const renderNode = (node: ASTNode, key: React.Key): React.ReactNode => {
    if (!node) return null

    switch (node.type) {
      case 'root':
        return (
          <div key={key}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </div>
        )

      case 'heading':
        const HeadingTag = `h${node.depth || 1}` as keyof JSX.IntrinsicElements
        const headingText = node.children
          ?.map(child => (child.type === 'text' ? child.value : ''))
          .join('') || ''
        const headingProps = node.data?.id ? { id: node.data.id } : {}

        return React.createElement(
          HeadingTag,
          { key, ...headingProps },
          headingText
        )

      case 'paragraph':
        return (
          <p key={key}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </p>
        )

      case 'text':
        return node.value || ''

      case 'inlineCode':
        return <code key={key}>{node.value}</code>

      case 'code':
        return (
          <pre key={key}>
            <code className={node.lang ? `language-${node.lang}` : ''}>
              {node.value}
            </code>
          </pre>
        )

      case 'list':
        const ListTag = node.ordered ? 'ol' : 'ul'
        return React.createElement(
          ListTag,
          { key },
          node.children?.map((child, i) => renderNode(child, i))
        )

      case 'listItem':
        return (
          <li key={key}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </li>
        )

      case 'table':
        return (
          <table key={key}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </table>
        )

      case 'tableRow':
        return (
          <tr key={key}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </tr>
        )

      case 'tableCell':
        return (
          <td key={key}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </td>
        )

      case 'image':
        return (
          <img
            key={key}
            src={node.url}
            alt={node.alt}
            title={node.title}
          />
        )

      case 'raw':
        // This is the magic! Render actual React components from your registry
        if (node.data?.hName) {
          // Inline Marp slides support (render compiled HTML + CSS)
          if (node.data.hName === 'marp-slides' && node.data.hProperties?.['data-html']) {
            return (
              <div key={key} dangerouslySetInnerHTML={{ __html: String(node.data.hProperties['data-html']) }} />
            )
          }
          const Component = registry[node.data.hName]
          if (Component) {
            // Special handling for code-tabs to fix empty code objects
            if (node.data.hName === 'code-tabs' && node.data.hProperties?.['data-tabs']) {
              try {
                const tabsData = JSON.parse(node.data.hProperties['data-tabs'])
                const fixedTabsData = tabsData.map((tab: any) => ({
                  ...tab,
                  code: typeof tab.code === 'object' ?
                    `// Code content not available\n// Referenced file: ${tab.title}` :
                    tab.code
                }))
                const fixedProps = {
                  ...node.data.hProperties,
                  'data-tabs': JSON.stringify(fixedTabsData)
                }
                return React.createElement(Component, {
                  key,
                  ...fixedProps
                })
              } catch (e) {
                console.warn('Error parsing code-tabs data:', e)
              }
            }

            return React.createElement(Component, {
              key,
              ...node.data.hProperties
            })
          } else {
            console.warn(`Unknown component: ${node.data.hName}`)
            return (
              <div key={key} style={{
                padding: '1rem',
                border: '2px dashed #ff6b6b',
                borderRadius: '8px',
                background: '#fff5f5'
              }}>
                <strong>Unknown Component:</strong> {node.data.hName}
                <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {JSON.stringify(node.data.hProperties, null, 2)}
                </pre>
              </div>
            )
          }
        }
        return null

      default:
        // For unhandled node types, try to render children
        if (node.children) {
          return (
            <div key={key} data-node-type={node.type}>
              {node.children.map((child, i) => renderNode(child, i))}
            </div>
          )
        }

        console.warn(`Unhandled node type: ${node.type}`)
        return (
          <div key={key} style={{
            padding: '0.5rem',
            background: '#fef3c7',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            Unhandled node: {node.type}
          </div>
        )
    }
  }

  return <>{renderNode(ast, 'root')}</>
}

export default ReportRenderer
