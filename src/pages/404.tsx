import { GetStaticProps } from 'next/types'

import ErrorMeta from '@/components/meta/ErrorMeta'
import RecetteError, { RecetteErrorProps } from '@/components/layouts/RecetteError'

interface StaticProps {
    error: RecetteErrorProps['error']
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
