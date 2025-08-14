import { CodeBlock } from '../CodeBlock'
import { MovableBlock } from 'components/Interactive/MovableBlock'
import { ImageEditor } from 'components/Interactive/ImageEditor'
import { TableVanilla } from 'components/Interactive/TableVanilla'

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

export const toHastCodeHandler = (h, { position, lang, value, marp, report }) => {
  if (marp) {
    return h(position, 'marp-slides', {
      'data-comments': JSON.stringify(marp.comments),
      'data-css': marp.css,
      'data-html': JSON.stringify(marp.html),
      'data-fonts': JSON.stringify(marp.fonts),
    })
  }
  if (report) {
    return h(position, 'marp-report', {
      'data-markdown': report.markdown,
    })
  }

  // Interactive movable area: ```movable {"width":..., "height":..., "items":[{...}]}
  if ((lang || '').trim() === 'movable') {
    return h(position, 'movable-block', {
      'data-json': String(value || ''),
    })
  }

  if ((lang || '').trim() === 'image_editor') {
    try {
      const config = JSON.parse(String(value || '{}'))
      return h(position, 'image-editor', {
        'data-src': config.src,
        'data-width': String(config.width || ''),
      })
    } catch {
      return h(position, 'pre', { 'data-code': value, 'data-language': lang?.trim() }, [])
    }
  }

  if ((lang || '').trim() === 'table_theme_vanilla') {
    return h(position, 'table-vanilla', { 'data-json': String(value || '{}') })
  }

  return h(
    position,
    'pre',
    { 'data-code': value, 'data-language': lang?.trim() },
    []
  )
}
