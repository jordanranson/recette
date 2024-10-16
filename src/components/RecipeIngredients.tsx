import React, { HTMLAttributes } from 'react'
import Link from 'next/link'

import { ifThen, forEach, ifElse } from '@/util/controlFlow'

import { Checkbox } from './controls/Checkbox'
import Block from './Block'
import Level from './Level'
import Icon from './Icon'

function formatFraction (value: number) {
    if (value === 0.25) return '¼'
    if (value === 0.50) return '½'
    if (value === 0.75) return '¾'

    return value.toString()
}

function formatUnit (unit: string, qty: number) {
    if (unit === 'cup') {
        return qty === 1 ? 'cup' : 'cups'
    }
    return qty
}

interface RecipeIngredientBlockProps {
    title?: string
    multiplier: number
    ingredients: RecipeIngredient[]
}

function RecipeIngredientBlock (props: RecipeIngredientBlockProps) {
    return (
        <Block size='medium'>
            {
                ifThen(props.title, () => (
                    <h4 className='text-title'>{props.title}</h4>
                ))
            }
            <ul className='RecipeIngredients__List'>
                {
                    forEach(props.ingredients as RecipeIngredient[], (ingredient: RecipeIngredient, index) => (
                        <li key={index}>
                            <label>
                                <Level size='small'>
                                    <Checkbox />
                                    <Level>
                                        <strong>
                                            <span>{formatFraction(ingredient.qty * props.multiplier)}</span>&nbsp;
                                            <span>{formatUnit(ingredient.unit, ingredient.qty * props.multiplier)}</span>
                                        </strong>&nbsp;
                                        {
                                            ifElse(
                                                ingredient.link, 
                                                () => (
                                                    <Link href={ingredient.link!} className='button button--link'>{ingredient.name}</Link>
                                                ), () => (
                                                    <span>{ingredient.name}</span>
                                                )
                                            )
                                        }
                                    </Level>
                                </Level>
                            </label>
                        </li>
                    ))
                }
            </ul>
        </Block>
    )
}

export interface RecipeIngredientsProps extends HTMLAttributes<HTMLDivElement> {
    attributes: RecipeAttributes
}

export default function RecipeIngredients (props: RecipeIngredientsProps) {
    const [ portionMultiplier, setPortionMultiplier ] = React.useState(1)

    const increasePortion = () => {
        if (portionMultiplier >= 100) return

        if (portionMultiplier >= 10) {
            setPortionMultiplier(portionMultiplier + 10)
        } else if (portionMultiplier >= 1) {
            setPortionMultiplier(portionMultiplier + 1)
        } else {
            setPortionMultiplier(portionMultiplier + 0.25)
        }
    }

    const decreasePortion = () => {
        if (portionMultiplier <= 0.25) return

        if (portionMultiplier > 10) {
            setPortionMultiplier(portionMultiplier - 10)
        } else if (portionMultiplier > 1) {
            setPortionMultiplier(portionMultiplier - 1)
        } else {
            setPortionMultiplier(portionMultiplier - 0.25)
        }
    }

    return (
        <div className='RecipeIngredients'>
            <h2 className='text-title'>
                <Level size='small'>
                    <span>Ingredients</span>
                    <span className='button button--primary'>
                        <Icon name='minusSmall' onClick={decreasePortion} />
                        <span style={{ padding: '0 0.35rem', display: 'inline-flex' }}>{'x ' + formatFraction(portionMultiplier)}</span>
                        <Icon name='plusSmall' onClick={increasePortion} />
                    </span>
                </Level>
            </h2>
            {
                ifElse(
                    Array.isArray(props.attributes.ingredients), 
                    () => (
                        <RecipeIngredientBlock 
                            multiplier={portionMultiplier} 
                            ingredients={props.attributes.ingredients as RecipeIngredient[]} 
                        />
                    ), 
                    () => (
                        <>
                            {
                                forEach(Object.keys(props.attributes.ingredients), (title, index) => (
                                    <RecipeIngredientBlock 
                                        key={index} 
                                        title={title} 
                                        multiplier={portionMultiplier} 
                                        ingredients={(props.attributes.ingredients as Record<string, RecipeIngredient[]>)[title]} 
                                    />
                                ))
                            }
                        </>
                    )
                )
            }
        </div>
    )
}
