import { useRef } from 'react'

function tryFindInput (el: HTMLElement) {
    return (
        el.querySelector('input') || 
        el.querySelector('select') ||
        el.querySelector('textarea')
    )
}

export function useClickToFocus (useQuerySelector: boolean = false) {
    const ref = useRef<HTMLInputElement>(null)

    const onClickOuter = (evt: React.MouseEvent<HTMLElement>) => {
        if (useQuerySelector) {
            const el = evt.target as HTMLElement
            let input = tryFindInput(el)
            if (!input) input = tryFindInput(el.parentElement!)
            if (input) input.focus()
            return
        }
    
        if (ref.current) {
            ref.current.focus()
            return
        }
    }

    return {
        ref,
        onClickOuter,
    }
}
