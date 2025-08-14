import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkSlug from 'remark-slug'
import { unified, Processor } from 'unified'
import { removePosition } from 'unist-util-remove-position'
import { imageParagraphToFigure } from './parse/image-paragraph-to-figure'

let parser: Processor | undefined

// Parse report markdown without Marp-specific transforms
export const parseReport = async (md: string) => {
  parser =
    parser ||
    unified().use(remarkParse).use(remarkGfm).use(remarkSlug).use(imageParagraphToFigure)

  return removePosition(await parser.run(parser.parse(md)), true)
}


