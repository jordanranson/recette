import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import TaxonomyMeta from '@/components/meta/TaxonomyMeta'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
import { fetchJson } from '@/util/fetchJson'
import { writeJson } from '@/scripts/writeJson'
 
interface StaticProps {
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async () => {
    const searchContext: SearchContext = await fetchJson('/search-context')

    const tags = searchContext.tags.map((tag) => tag.id)

    return {
        paths: tags.map((tag) => ({ params: { tag } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    if (process.env.NODE_ENV === 'development') {
        await writeJson()
    }
    
    const config: RecetteConfig = await fetchJson('/config')

    let taxonomy: TaxonomyItem
    let searchContext: SearchContext
    {
        const result = await fetchJson<{
            taxonomy: TaxonomyItem,
            searchContext: SearchContext
        }>('/tag/' + context.params!.tag)

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

export default function TagPage (props: StaticProps) {
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
