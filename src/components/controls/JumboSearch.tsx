import React, { HTMLAttributes } from 'react'

import { SearchInput } from './Input'

interface JumboSearchProps extends HTMLAttributes<HTMLDivElement> {
    onSearch?: (query: string) => void
}

export function JumboSearch (props: JumboSearchProps) {
    const onChange = (evt: React.FormEvent<HTMLInputElement>) => {
        props.onSearch?.(evt.currentTarget.value)
    }

    return (
        <SearchInput 
            large 
            onChange={onChange}
        />
    )
}
