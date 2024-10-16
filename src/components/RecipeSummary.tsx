import React, { HTMLAttributes } from 'react'
import Link from 'next/link'

import { forEach, ifThen } from '@/util/controlFlow'

import Block from './Block'
import { LinkButton, useButtonClassName } from './controls/Button'
import { toId } from '@/util/strings'

const ABOUT_ITEM_KEYS = [
    'caloriesPerServing',
    'cookTime',
    'prepTime',
    'servingSize',
    'yield',
    'yieldUnit',
]

function useAbout (attributes: RecipeAttributes) {
    const aboutItems = Object.keys(attributes)
        .map(key => {
            if (ABOUT_ITEM_KEYS.includes(key)) {
                return attributes[key as keyof RecipeAttributes]
            }
            return ''
        })
        .filter(value => value !== '')

    return aboutItems.length > 0
}

function formatMinutes (minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    const formatted = []

    if (hours > 0) {
        formatted.push(hours + 'h')
    }
    if (remainingMinutes > 0) {
        formatted.push(remainingMinutes + 'm')
    }

    return formatted.join(' ')
}

export interface RecipeSummaryProps extends HTMLAttributes<HTMLDivElement> {
    attributes: RecipeAttributes
}

export default function RecipeSummary (props: RecipeSummaryProps) {
    const hasAbout = useAbout(props.attributes)
    const buttonClassName = useButtonClassName({ kind: 'link' })
    
    return (
        <div className='RecipeSummary'>
            <Block size='medium'>
                <Link href={`/${props.attributes.categoryId}`} className='text-taxonomy'>{props.attributes.categoryId?.replace(/_-\./g, ' ')}</Link>
            </Block>
            <Block size='small'>
                <h1>{props.attributes.title}</h1>
            </Block>
            <Block size='small'>
                <p>
                    <em>
                        <span>by&nbsp;</span>
                        <LinkButton href={'/author/' + toId(props.attributes.author)}>
                            {props.attributes.author}
                        </LinkButton>
                    </em>
                </p>
            </Block>
            {
                ifThen(props.attributes.summary, () => (
                    <Block size='medium'>
                        <div dangerouslySetInnerHTML={{ __html: props.attributes.summary }} />
                    </Block>
                ))
            }
            {
                ifThen(hasAbout, () => (
                    <Block size='medium'>
                        <dl className='RecipeSummary__About'>
                            {
                                ifThen(props.attributes.yield, () => (
                                    <>
                                        <dt>Yield</dt>
                                        <dd>
                                            <span>{props.attributes.yield}</span>&nbsp;
                                            <span>{props.attributes.yieldUnit || ''}</span>
                                        </dd>
                                    </>
                                ))
                            }
                            {
                                ifThen(props.attributes.servingSize, () => (
                                    <>
                                        <dt>Serving Size</dt>
                                        <dd>
                                            <span>{props.attributes.servingSize}</span>&nbsp;
                                            <span>{props.attributes.yieldUnit || ''}</span>
                                        </dd>
                                    </>
                                ))
                            }
                            {
                                ifThen(props.attributes.caloriesPerServing, () => (
                                    <>
                                        <dt>Calories / Serving</dt>
                                        <dd>
                                        <span>{props.attributes.caloriesPerServing}</span>
                                        <span>kcal</span>
                                        </dd>
                                    </>
                                ))
                            }
                            {
                                ifThen(props.attributes.prepTime, () => (
                                    <>
                                        <dt>Prep Time</dt>
                                        <dd>{formatMinutes(props.attributes.prepTime!)}</dd>
                                    </>
                                ))
                            }
                            {
                                ifThen(props.attributes.cookTime, () => (
                                    <>
                                        <dt>Cook Time</dt>
                                        <dd>{formatMinutes(props.attributes.prepTime!)}</dd>
                                    </>
                                ))
                            }
                            {
                                ifThen(props.attributes.prepTime && props.attributes.cookTime, () => (
                                    <>
                                        <dt>Total Time</dt>
                                        <dd>{formatMinutes(props.attributes.prepTime! + props.attributes.cookTime!)}</dd>
                                    </>
                                ))
                            }
                        </dl>
                    </Block>
                ))
            }
            {
                ifThen(props.attributes.tags.length > 0, () => (
                    <Block size='medium'>
                        <div className='RecipeSummary__Tags'>
                            {
                                forEach(props.attributes.tags, (tag, index) => (
                                    <LinkButton href={`/tag/${toId(tag)}`} kind='primary' key={index}>{tag}</LinkButton>
                                ))
                            }
                        </div>
                    </Block>
                ))
            }
        </div>
    )
}
