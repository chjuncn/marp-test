import { CodeBlock } from '../CodeBlock'

export const Pre: React.FC = (props) => {
  if (props['data-code'] === undefined) return <pre {...props} />

  return (
    <CodeBlock
      className="sm:mx-auto sm:w-11/12 lg:w-5/6"
      language={props['data-language']}
      copyButton
    >
      {props['data-code']}
    </CodeBlock>
  )
}

export const toHastCodeHandler = (h, { position, lang, value, marp }) => {
  // Only handle Marp slides here - all report functionality is handled by marp-report-core plugins
  if (marp) {
    return h(position, 'marp-slides', {
      'data-comments': JSON.stringify(marp.comments),
      'data-css': marp.css,
      'data-html': JSON.stringify(marp.html),
      'data-fonts': JSON.stringify(marp.fonts),
    })
  }

  // Default code block rendering - all other custom blocks are handled by plugins
  return h(
    position,
    'pre',
    { 'data-code': value, 'data-language': lang?.trim() },
    []
  )
}
