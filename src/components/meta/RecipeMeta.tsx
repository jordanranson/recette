import React from 'react'
import Head from 'next/head'

import { toTitle } from '@/util/strings'

interface MetaProps {
    path: string
    attributes: RecipeAttributes
}

export default function Meta (props: MetaProps) {
    const ingredients = (
        Array.isArray(props.attributes.ingredients) 
            ? props.attributes.ingredients 
            : Object.values(props.attributes.ingredients).flat()
    ).map(ingredient => `${ingredient.qty} ${ingredient.unit} ${ingredient.name}`)
    
    return (
        <Head>
            <title>{`${props.attributes.title} | Recette`}</title>
            <meta charSet='UTF-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='description' content={props.attributes.description} />
            <meta name='keywords' content={props.attributes.tags.join(', ')} />
            <meta property='og:title' content={props.attributes.title} />
            <meta property='og:type' content='article' />
            <meta property='og:url' content={props.path} />
            <link rel='icon' href='/icon.svg' />
            <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(
                {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    'headline': props.attributes.title + ' | Recette',
                    'author': {
                        '@type': 'Person',
                        'name': props.attributes.author
                    },
                    'datePublished': props.attributes.modified,
                    'publisher': {
                        '@type': 'Organization',
                        'name': props.attributes.author,
                        'logo': {
                            '@type': 'ImageObject',
                            'url': '/icon.svg'
                        }
                    },
                    'description': props.attributes.description,
                    'articleBody': props.attributes.summary,
                    'mainEntityOfPage': {
                        '@type': 'WebPage',
                        '@id': props.path
                    }
                }
            )}} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(
                {
                    '@context': 'https://schema.org/',
                    '@type': 'Recipe',
                    'name': props.attributes.title,
                    'author': {
                        '@type': 'Person',
                        'name': props.attributes.author
                    },
                    'datePublished': props.attributes.modified,
                    'description': props.attributes.description,
                    'prepTime': props.attributes.prepTime ? `PT${props.attributes.prepTime}M` : '',
                    'cookTime': props.attributes.cookTime ? `PT${props.attributes.cookTime}M` : '',
                    'keywords': props.attributes.tags.join(', '),
                    'recipeYield': props.attributes.yield ? `${props.attributes.yield} ${props.attributes.yieldUnit}` : '',
                    'recipeCategory': toTitle(props.attributes.categoryId),
                    'nutrition': props.attributes.caloriesPerServing && {
                        '@type': 'NutritionInformation',
                        'calories': `${props.attributes.caloriesPerServing} calories`
                    },
                    'recipeIngredient': ingredients,
                }
            )}} />
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
