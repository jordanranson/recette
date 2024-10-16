import React, { HTMLAttributes } from 'react'
import Link from 'next/link'

export interface IconProps extends HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
    name: string
    size?: 'small' | 'regular' | 'large'
}

export default function Icon (props: IconProps) {
    const className = `Icon Icon--size-${props.size || 'regular'}`

    return (
        <i className={className} onClick={props.onClick}>
            <svg className={className}>
                <use xlinkHref={`#${props.name}`} />
            </svg>
        </i>
    )
}

export function IconButton (props: IconProps) {
    return (
        <button className='button button--primary IconButton' onClick={props.onClick}>
            <Icon 
                name={props.name}
                size={props.size}
            />
        </button>
    )
}

export function IconButtonLink (props: IconProps & { href: string }) {
    return (
        <Link href={props.href} className='button button--primary IconButton'>
            <Icon 
                name={props.name}
                size={props.size}
            />
        </Link>
    )
}
