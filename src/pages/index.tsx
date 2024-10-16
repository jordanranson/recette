import type { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import TaxonomyMeta from '@/components/meta/TaxonomyMeta'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
import { fetchJson } from '@/util/fetchJson'
 
interface StaticProps {
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticProps = (async () => {
    const config: RecetteConfig = await fetchJson('/config')
    const searchContext: SearchContext = await fetchJson('/search-context')

    const taxonomy: TaxonomyItem = {
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
