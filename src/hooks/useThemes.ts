import { useEffect } from 'react'
import { AppState } from './useAppState'

export function useThemes (theme: AppState[ 'settings' ][ 'theme' ]) {
    useEffect(() => {
        if (theme === 'system') {
            document.body.removeAttribute('data-theme')
        } else {
            document.body.setAttribute('data-theme', theme)
        }
    }, [ theme ])
}
