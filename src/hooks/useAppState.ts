/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reducer, useEffect, useReducer, useRef } from 'react'

export interface AppState {
    settings: {
        theme: 'system' | 'light' | 'dark'
    }
    userData: object
}

interface AppStateActionSetTheme {
    type: 'SET_THEME'
    value: AppState[ 'settings' ][ 'theme' ]
}

interface AppStateActionToggleTheme {
    type: 'TOGGLE_THEME'
    value?: any
}

interface AppStateActionClearUserData {
    type: 'CLEAR_USER_DATA'
    value?: any
}

interface AppStateActionRestoreState {
    type: 'RESTORE_STATE'
    value?: any
}

export type AppStateAction = 
    AppStateActionSetTheme |
    AppStateActionToggleTheme |
    AppStateActionClearUserData |
    AppStateActionRestoreState

export function useAppState (): [ state: AppState, dispatch: React.Dispatch<AppStateAction> ] {
    const reducer: Reducer<AppState, AppStateAction> = (state, action) => {
        switch (action.type) {

        case 'SET_THEME':
            return saveAppState({
                ...state,
                settings: {
                    ...state.settings,
                    theme: action.value
                }
            })

        case 'TOGGLE_THEME':
            const theme = state.settings.theme === 'system'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark')
                : (state.settings.theme === 'light' ? 'dark' : 'light')

            return saveAppState({
                ...state,
                settings: {
                    ...state.settings,
                    theme
                }
            })

        case 'CLEAR_USER_DATA':
            return saveAppState({
                ...state,
                userData: {
                    notes: [],
                    checkboxes: []
                }
            })

        case 'RESTORE_STATE':
            const restoredState = restoreAppState()
            return {
                ...state,
                settings: restoredState?.settings ?? state.settings,
                userData: restoredState?.userData ?? state.userData
            }

        default:
            throw new Error()
        }
    }
    
    const initialState: AppState = {
        settings: {
            theme: 'system'
        },
        userData: {}
    }
    
    const [ state, dispatch ] = useReducer(
        reducer, 
        initialState
    )
    
    const firstRenderRef = useRef(true)

    useEffect(() => {
        if (!firstRenderRef.current) return
        firstRenderRef.current = false

        dispatch({ type: 'RESTORE_STATE' })
    })
    
    return [ state, dispatch ]
}

function saveAppState (state: AppState) {
    const saveState: Partial<AppState> = { ...state }
    localStorage.setItem('recette:appState', JSON.stringify(saveState))
    return state
}

export function restoreAppState (): Partial<AppState> | undefined {
    const savedState = localStorage.getItem('recette:appState')
    if (savedState) return JSON.parse(savedState)
    return undefined
}
