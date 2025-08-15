import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import { unified, Processor } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import { imageParagraphToFigure } from './image-paragraph-to-figure'
import { marpCodeBlock } from './marp-code-block'

import {
  reportMarkdown as reportMarkdownBlock,
  reportMerge as reportMergeBlock,
  reportTabs as reportTabsBlock,
  movable as movableBlock,
  imageEditor as imageEditorBlock,
  tableVanilla as tableVanillaBlock,
} from 'marp-report-core'

// Loader to read markdown from `website/blog/*.md`
const blogCtx = () => require.context('blog', false, /\.md$/)
const loadBlog = (id: string) => {
  const normalized = id.replace(/^blog\//, '').replace(/^\.\//, '')
  const key = `./${normalized.endsWith('.md') ? normalized : `${normalized}.md`}`
  const mod = blogCtx()(key)
  return typeof mod === 'string' ? (mod as string) : (mod as any).default
}

let parser: Processor | undefined

export const parse = async (md: string) => {
  parser =
    parser ||
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkSlug)
      .use(imageParagraphToFigure)

      .use([marpCodeBlock])
      // Report features from marp-report-core
      .use(reportMergeBlock(loadBlog))
      .use(reportMarkdownBlock())
      .use(reportTabsBlock(loadBlog))
      .use(movableBlock())
      .use(imageEditorBlock())
      .use(tableVanillaBlock())

  return removePosition(await parser.run(parser.parse(md)), true)
}
