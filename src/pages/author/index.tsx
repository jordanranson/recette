import type { GetStaticProps } from 'next'
import Head from 'next/head'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
 
interface StaticProps {
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticProps = (async (context) => {
    let config: RecetteConfig = {} as any
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const taxonomy: TaxonomyItem = {
        title: 'All Authors',
        id: 'author',
        root: 'author',
        recipes: [],
    }

    return { 
        props: { 
            taxonomy,
            config,
            searchContext
        } 
    }
}) satisfies GetStaticProps<StaticProps>

export default function ListAuthorPage (props: StaticProps) {
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
