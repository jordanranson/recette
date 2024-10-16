import './RecipeContent.sass'

import React, { HTMLAttributes } from 'react'

import Block from './Block'

export interface RecipeContentProps extends HTMLAttributes<HTMLDivElement> {
    content: string
}

export default function RecipeContent (props: RecipeContentProps) {
    return (
        <>
            <Block size='medium'>
                <h2 className='text-title'>Directions</h2>
            </Block>
            <Block size='medium'>
                <div
                    className='RecipeContent'
                    dangerouslySetInnerHTML={{ __html: props.content }}
                />  
            </Block>
        </>
    )
}
