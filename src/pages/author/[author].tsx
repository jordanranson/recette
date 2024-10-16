import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import TaxonomyMeta from '@/components/meta/TaxonomyMeta'
import RecetteTaxonomy from '@/components/layouts/RecetteTaxonomy'

interface StaticProps {
    author: AuthorItem
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

    const authors = searchContext.authors.map((author) => author.id)

    return {
        paths: authors.map((author) => ({ params: { author } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    let config: RecetteConfig
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let author: AuthorItem
    let taxonomy: TaxonomyItem
    let searchContext: SearchContext
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
