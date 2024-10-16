import type { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import TaxonomyMeta from '@/components/meta/TaxonomyMeta'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
 
interface StaticProps {
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticProps = (async () => {
    let config: RecetteConfig
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let searchContext: SearchContext
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const taxonomy: TaxonomyItem = {
        title: 'All Tags',
        id: 'tag',
        root: 'tag',
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

export default function ListTagPage (props: StaticProps) {
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
