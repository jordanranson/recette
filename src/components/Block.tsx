import React, { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface BlockProps extends HTMLAttributes<HTMLDivElement> {
    size?: 'verySmall' | 'small' | 'regular' | 'medium' | 'large' | 'veryLarge'
    align?: 'center' | 'right'
    trim?: 'top' | 'bottom' | 'both'
}

export default function Block (props: BlockProps) {
    const className = clsx(
        'Block',
        props.size && `Block--size-${props.size}`,
        props.align && `Block--align-${props.align}`,
        props.trim && `Block--trim-${props.trim}`,
        props.className
    )

    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
