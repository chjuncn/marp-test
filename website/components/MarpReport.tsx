import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { renderToReact } from 'utils/markdown'

export const MarpReport = (props) => {
  const markdown: string = props['data-markdown'] || ''
  const [mdast, setMdast] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // Reuse the same site-wide parser that returns { mdast }
      const parsed = await (await import('utils/markdown')).parse(markdown)
      if (mounted) setMdast(parsed.mdast)
    })()
    return () => {
      mounted = false
    }
  }, [markdown])

  return (
    <section className={classNames('marp-report')}>
      {mdast ? renderToReact(mdast, { anchorLink: true }) : null}
    </section>
  )
}


