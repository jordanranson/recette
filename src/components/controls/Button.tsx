import React, { HTMLAttributes } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    kind?: 'primary' | 'secondary' | 'link' 
    size?: 'small' | 'large'
    disabled?: boolean
    linkActive?: boolean
}

function useClassName (props: ButtonProps) {
    return clsx(
        'button',
        props.kind ? `button--${props.kind}` : 'button--primary',
        props.size && `button--size-${props.size}`,
        props.disabled && 'button--disabled',
        props.linkActive && 'button--link--active',
        props.className
    )
}

export function Button (props: ButtonProps) {
    const className = useClassName(props)

    return (
        <button className={className} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

interface InputButtonProps extends ButtonProps {
    type: 'submit' | 'reset'
}

export function InputButton (props: InputButtonProps) {
    const className = useClassName(props)

    return (
        <button className={className} type={props.type}>
            {props.children}
        </button>
    )
}

interface LinkButtonProps extends ButtonProps {
    href: string
}

export function LinkButton (props: LinkButtonProps) {
    const className = useClassName({
        ...props,
        kind: props.kind || 'link'
    })

    return (
        <Link className={className} href={props.href}>
            {props.children}
        </Link>
    )
}
