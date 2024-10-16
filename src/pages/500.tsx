import Head from 'next/head'
import { GetStaticProps } from 'next/types'

import ErrorMeta from '@/components/meta/ErrorMeta'
import RecetteError, { RecetteErrorProps } from '@/components/layouts/RecetteError'

interface StaticProps {
    error: RecetteErrorProps['error']
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

export default function NotFoundPage (props: StaticProps) {
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
