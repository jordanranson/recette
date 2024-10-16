import React from 'react'
import Head from 'next/head'

import { RecetteErrorProps } from '@/components/layouts/RecetteError'

interface MetaProps {
    path: string
    error: RecetteErrorProps['error']
}

export default function Meta (props: MetaProps) {
    return (
        <Head>
            <title>{`${props.error.title} | Recette`}</title>
            <meta charSet='UTF-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='description' content={props.error.message} />
            <link rel='icon' href='/icon.svg' />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(
                {
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    'name': 'Recette',
                    'applicationCategory': 'LifestyleApplication',
                    'operatingSystem': 'Any',
                    'offers': {
                        '@type': 'Offer',
                        'price': '0.00',
                        'priceCurrency': 'USD',
                        'availability': 'https://schema.org/InStock'
                    },
                    'softwareVersion': '1.0.0',
                    'description': 'Markdown powered recipe manager',
                    'features': [],
                    'downloadUrl': 'https://github.com/jordanranson/recette',
                }
            )}} />
        </Head>
    )
}
