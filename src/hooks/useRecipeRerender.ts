import { useEffect, useRef } from 'react'

export function useRecipeRerender (checksum: string, categoryId: string, recipeId: string) {
    const firstRenderRef = useRef(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    useEffect(() => {
        const poll = async () => {
            if (process.env.NODE_ENV !== 'development') return;
        
            const res = await fetch(`/api/regenerate/test-recipe?checksum=${checksum}&categoryId=${categoryId}&recipeId=${recipeId}`)
            const { contentChanged } = await res.json() as {
                contentChanged: boolean,
            }

            if (contentChanged) {
                await fetch(`/api/regenerate/write-json`)
                window.location.reload()
                return
            }

            timeoutRef.current = setTimeout(poll, 1000)
        }


        if (firstRenderRef.current) {
            firstRenderRef.current = false
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            poll()
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    })
}
