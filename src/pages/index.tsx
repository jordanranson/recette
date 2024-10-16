import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import Head from 'next/head'
import RecetteTaxonomy from '@/components/RecetteTaxonomy'
 
interface StaticProps {
    taxonomy: Taxonomy
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

    const taxonomy: Taxonomy = {
        title: 'All Recipes',
        id: '',
        root: true,
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

export default function IndexPage (props: StaticProps) {
  return (
    <>
        <Head>
            <title>Recette</title>
            <meta name='description' content='' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <link rel='icon' href='/icon.svg' />
        </Head>
        {/* <RecetteTaxonomy
            taxonomy={props.taxonomy}
            config={props.config}
            searchContext={props.searchContext}
        /> */}
        <div>
            <pre>{JSON.stringify(props.taxonomy, null, 4)}</pre>
            <pre>{JSON.stringify(props.config, null, 4)}</pre>
            <pre>{JSON.stringify(props.searchContext, null, 4)}</pre>
        </div>
    </>
  )
}
