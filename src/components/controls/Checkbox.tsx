import React, { useState } from 'react'
import Icon from '../Icon'

export function Checkbox () {
    const [ checked, setChecked ] = useState(false)

    const onChange = () => {
        setChecked(!checked)
    }

    return (
        <span className='checkbox' data-checked={checked}>
            <input
                type='checkbox'
                checked={checked}
                onChange={onChange}
            />
            <span className='button button--primary'>
                <Icon name='cross' />
            </span>
        </span>
    )
}
