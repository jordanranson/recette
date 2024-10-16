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
        status: 500,
        title: 'Internal Server Error',
        message: 'An error has occurred. Please try again later.',
    }

    return { 
        props: { 
            error,
            config,
            searchContext
        } 
    }
}) satisfies GetStaticProps<StaticProps>

export default function ErrorPage (props: StaticProps) {
    return (
        <>
            <ErrorMeta
                path='/500'
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
