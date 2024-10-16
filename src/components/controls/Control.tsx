import React, { HTMLAttributes } from 'react'

import Block from '../Block'
import Level from '../Level'

interface ControlProps extends HTMLAttributes<HTMLDivElement> {
    label: string | React.ReactNode
    children: React.ReactNode
}

export function Control (props: ControlProps) {
    return (
        <Level {...props}>
            <label className='label'>
                {props.label}
            </label>
            <Block align='right'>
                <Level size='small'>
                    {props.children}
                </Level>
            </Block>
        </Level>
    )
}
