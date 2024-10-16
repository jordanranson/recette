import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'

import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'

interface StaticProps {
    author: AuthorItem
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async () => {
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const authors = searchContext.authors.map((author) => author.id)

    return {
        paths: authors.map((author) => ({ params: { author } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    let config: RecetteConfig = {} as any
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let author: AuthorItem = {} as any
    let taxonomy: TaxonomyItem = {} as any
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/taxonomy/author/' + context.params!.author)
        const result = await res.json()

        author = result.author
        taxonomy = result.taxonomy
        searchContext = result.searchContext
    }

    return { 
        props: { 
            author,
            taxonomy,
            config,
            searchContext
        } 
    }
}) satisfies GetStaticProps<StaticProps>

export default function AuthorPage (props: StaticProps) {
  return (
    <>
      <Head>
        <title>Recette</title>
        <meta name='description' content='' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/icon.svg' />
      </Head>
      <RecetteTaxonomy
            taxonomy={props.taxonomy}
            config={props.config}
            searchContext={props.searchContext}
        />
    </>
  )
}
