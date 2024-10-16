import { Dispatch, useEffect, useRef } from 'react'

import { debounce } from '@/util/debounce'
import { splitRecipeParts, parseContentFromMarkdown } from '@/markdown/parser'
import { AppState, AppStateAction } from '@/hooks//useAppState'

export function useRecipeRerender (state: AppState, dispatch: Dispatch<AppStateAction>) {
    const firstRenderRef = useRef(true)
    
    useEffect(debounce(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false
            return
        }
        
        const parts = splitRecipeParts(state.recipe.raw)
        const { html } = parseContentFromMarkdown(parts[1])

        dispatch({
            type: 'SET_CONTENT',
            value: { html }
        })
    }, 100), [ state.recipe ])
}
