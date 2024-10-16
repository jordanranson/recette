import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import TaxonomyMeta from '@/components/meta/TaxonomyMeta'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
 
interface StaticProps {
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async () => {
    let searchContext: SearchContext
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
    let config: RecetteConfig
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let taxonomy: TaxonomyItem
    let searchContext: SearchContext
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

export default function ListRecipePage (props: StaticProps) {
    const router = useRouter()

    return (
        <>
            <TaxonomyMeta
                path={router.asPath}
                taxonomy={props.taxonomy}
            />
            <RecetteTaxonomy
                taxonomy={props.taxonomy}
                config={props.config}
                searchContext={props.searchContext}
            />
        </>
    )
}
