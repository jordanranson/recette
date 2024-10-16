import React, { HTMLAttributes, useState } from 'react'
import clsx from 'clsx'

import { ifElse, ifThen } from '@/util/controlFlow'
import { useClickToFocus } from '@/hooks/useClickToFocus'

import Icon from '../Icon'

interface InputProps extends HTMLAttributes<HTMLInputElement> {
    type?: 'text' | 'email' | 'search'
    large?: boolean
    short?: boolean
    icons?: React.ReactNode
}

function useClassName (props: InputProps) {
    return clsx(
        'input',
        props.large && 'input--large',
        props.short && 'input--short',
        props.type === 'search' && 'input--search',
    )
}

export function Input (props: InputProps) {
    const className = useClassName(props)

    return (
        <div className={className}>
            <input
                type={props.type || 'text'}
            />
            {
                ifThen(props.icons, () => (
                    <span className='input__icons'>{props.icons}</span>
                ))
            }
        </div>
    )
}

export function PasswordInput (props: InputProps) {
    const className = useClassName(props)
    const [ showPassword, setShowPassword ] = useState(false)

    const iconSize = props.large
        ? 'regular'
        : 'small'

    return (
        <div className={className}>
            {
                ifElse(showPassword, 
                    () => (<>
                        <input
                            type='text'
                        />
                        <span className='input__icons'>
                            <Icon
                                name='eye'
                                size={iconSize}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                         </span>
                    </>),
                    () => (<>
                        <input
                            type='password'
                        />
                        <span className='input__icons'>
                            <Icon
                                name='eyeCrossed'
                                size={iconSize}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                         </span>
                    </>)
                )
            }
        </div>
    )
}

export function SearchInput (props: InputProps) {
    const className = useClassName({
        ...props,
        type: 'search'
    })

    const iconSize = props.large
        ? 'regular'
        : 'small'

    return (
        <div className={className}>
            <span className='input__icons'>
                <Icon name='search' color='light' size={iconSize} />
            </span>
            <input
                type='search'
                onChange={props.onChange}
            />
            {
                ifThen(props.icons, () => (
                    <span className='input__icons'>{props.icons}</span>
                ))
            }
        </div>
    )
}

interface GroupedInputProps extends InputProps {
    label: string
}

export function GroupedInput (props: GroupedInputProps) {
    const className = clsx(
        'input',
        'input--grouped',
        props.className
    )
    const { ref: inputRef, onClickOuter } = useClickToFocus()

    return (
        <div className={className} onClick={onClickOuter}>
            <input
                ref={inputRef}
                type={props.type || 'text'}
            />
            <label className='label'>
                {props.label}
            </label>
        </div>
    )
}

export function GroupedPasswordInput (props: GroupedInputProps) {
    const className = clsx(
        'input',
        'input--grouped',
        props.className
    )
    const { ref: inputRef, onClickOuter } = useClickToFocus()
    const [ showPassword, setShowPassword ] = useState(false)

    return (
        <div className={className} onClick={onClickOuter}>
            {
                ifElse(showPassword, 
                    () => (<>
                        <input
                            ref={inputRef}
                            type='text'
                        />
                        <i 
                            onClick={() => setShowPassword(!showPassword)}
                         />
                    </>),
                    () => (<>
                        <input
                            ref={inputRef}
                            type='password'
                        />
                        <i 
                            onClick={() => setShowPassword(!showPassword)} 
                        />
                    </>)
                )
            }
            <label className='label'>
                {props.label}
            </label>
        </div>
    )
}
