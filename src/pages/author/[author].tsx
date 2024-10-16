import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import TaxonomyMeta from '@/components/meta/TaxonomyMeta'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'
import { fetchJson } from '@/util/fetchJson'
import { writeJson } from '@/scripts/writeJson'

interface StaticProps {
    author: AuthorItem
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async () => {
    const searchContext: SearchContext = await fetchJson('/search-context')

    const authors = searchContext.authors.map((author) => author.id)

    return {
        paths: authors.map((author) => ({ params: { author } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    if (process.env.NODE_ENV === 'development') {
        await writeJson()
    }
    
    const config: RecetteConfig = await fetchJson('/config')

    let author: AuthorItem
    let taxonomy: TaxonomyItem
    let searchContext: SearchContext
    {
        const result = await fetchJson<{
            author: AuthorItem,
            taxonomy: TaxonomyItem,
            searchContext: SearchContext
        }>('/author/' + context.params!.author)

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
