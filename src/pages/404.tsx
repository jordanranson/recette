import { GetStaticProps } from 'next/types'

import ErrorMeta from '@/components/meta/ErrorMeta'
import RecetteError, { RecetteErrorProps } from '@/components/layouts/RecetteError'
import { fetchJson } from '@/util/fetchJson'

interface StaticProps {
    error: RecetteErrorProps['error']
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticProps = (async () => {
    const config: RecetteConfig = await fetchJson('/config')
    const searchContext: SearchContext = await fetchJson('/search-context')

    const error = {
        status: 404,
        title: 'Page Not Found',
        message: 'The page you are looking for doesn\'t exist.',
    }

    return { 
        props: { 
            error,
            config,
            searchContext
        } 
    }
}) satisfies GetStaticProps<StaticProps>

export default function NotFoundPage (props: StaticProps) {
    return (
        <>
            <ErrorMeta
                path='/404'
                error={props.error}
            />
            <RecetteError 
                error={props.error} 
                config={props.config} 
                searchContext={props.searchContext}
            />
        </>
    )
}
