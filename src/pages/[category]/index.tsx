import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
 
interface StaticProps {
    taxonomy: Taxonomy
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async () => {
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const categories = searchContext.taxonomies.map((taxonomy) => taxonomy.id)

    return {
        paths: categories.map((category) => ({ params: { category } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    let config: RecetteConfig = {} as any
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let taxonomy: Taxonomy = {} as any
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/taxonomy/category/' + context.params!.category)
        const result = await res.json()

        taxonomy = result.taxonomy
        searchContext = result.searchContext
    }

    return { 
        props: { 
            taxonomy,
            config,
            searchContext
        } 
    }
}) satisfies GetStaticProps<StaticProps>

export default function ListCategoryPage (props: StaticProps) {
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
