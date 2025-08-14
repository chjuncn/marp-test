import path from 'path'
import Head from 'next/head'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { parse, renderToReact } from 'utils/markdown'
import { Typography } from 'components/Typography'

const STANDALONE_SLUGS = ['test-report', 'template-report', 'data-report'] as const

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: STANDALONE_SLUGS.map((s) => ({ params: { slug: s } })),
  fallback: false,
})

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const slug = params?.slug as typeof STANDALONE_SLUGS[number]
  const { default: md } = await import(`blog/${path.join(slug)}.md`)
  const parsed = await parse(md)
  return { props: { slug, data: parsed.data, mdast: parsed.mdast } }
}

const Standalone = ({ slug, data, mdast }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{data.title || slug}</title>
    </Head>
    <main className="standalone">
      <article className="mx-auto max-w-screen-lg px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">{data.title || slug}</h1>
        <Typography>{renderToReact(mdast)}</Typography>
      </article>
    </main>
    <style jsx global>{`
      .standalone {
        background: #f8fafc;
        color: #0f172a;
        min-height: 100vh;
      }
      .standalone .prose img {
        max-width: 100%;
        height: auto;
      }
    `}</style>
  </>
)

export default Standalone


