import './Level.sass'

import React, { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface LevelProps extends HTMLAttributes<HTMLDivElement> {
    size?: 'verySmall' | 'small' | 'regular' | 'medium'
    align?: 'center' | 'right'
}

export default function Level (props: LevelProps) {
    const className = clsx(
        'Level',
        props.size && `Level--size-${props.size}`,
        props.align && `Level--align-${props.align}`,
        props.className
    )

    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
