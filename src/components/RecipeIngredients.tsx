import React, { HTMLAttributes } from 'react'

import { ifThen, forEach, ifElse } from '@/util/controlFlow'

import { Checkbox } from './controls/Checkbox'
import Block from './Block'
import Level from './Level'
import Icon from './Icon'

function formatFraction (value: number) {
    const remainder = (value % 1).toFixed(3)
    const wholeNumber = Math.floor(value) === 0 ? '' : Math.floor(value)

    let fraction = ''
    if (remainder === '0.250') fraction = '¼'
    if (remainder === '0.500') fraction = '½'
    if (remainder === '0.750') fraction = '¾'
    if (remainder === '0.142') fraction = '⅐'
    if (remainder === '0.625') fraction = '⅝'
    if (remainder === '0.111') fraction = '⅑'
    if (remainder === '0.100') fraction = '⅒'
    if (remainder === '0.333') fraction = '⅓'
    if (remainder === '0.666') fraction = '⅔'
    if (remainder === '0.200') fraction = '⅕'
    if (remainder === '0.400') fraction = '⅖'
    if (remainder === '0.600') fraction = '⅗'
    if (remainder === '0.800') fraction = '⅘'
    if (remainder === '0.166') fraction = '⅙'
    if (remainder === '0.833') fraction = '⅚'
    if (remainder === '0.125') fraction = '⅛'
    if (remainder === '0.375') fraction = '⅜'
    if (remainder === '0.625') fraction = '⅝'
    if (remainder === '0.875') fraction = '⅞'

    const result = [ wholeNumber, fraction ].join(' ').trim()

    return !result ? value : result
}

function formatUnit (unit: string, qty: number) {
    if (unit === 'cup') {
        return qty === 1 ? 'cup' : 'cups'
    }
    if (unit === 'dash') {
        return qty === 1 ? 'dash' : 'dashes'
    }
    if (unit === 'barspoon') {
        return qty === 1 ? 'barspoon' : 'barspoon'
    }
    if (unit === 'measure') {
        return qty === 1 ? 'measure' : 'measures'
    }
    return unit
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
                                            <span>{formatFraction(ingredient.qty * props.multiplier)}</span>
                                            {
                                                ifThen(
                                                    ingredient.unit, 
                                                    () => (
                                                        <>
                                                            &nbsp;
                                                            <span>{formatUnit(ingredient.unit, ingredient.qty * props.multiplier)}</span>
                                                        </>
                                                    )
                                                )
                                            }
                                        </strong>&nbsp;
                                        {
                                            ifElse(
                                                ingredient.link, 
                                                () => (
                                                    <a 
                                                        className='button button--link'
                                                        href={ingredient.link!} 
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                    >
                                                        {ingredient.name}
                                                    </a>
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
