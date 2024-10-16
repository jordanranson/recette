import './RecetteError.sass'

import React, { HTMLAttributes } from 'react'

import { useAppState } from '../hooks/useAppState'
import { useThemes } from '../hooks/useThemes'

import Block from './Block'
import NavBar from './NavBar'
import PageFooter from './PageFooter'

export interface RecetteErrorProps extends HTMLAttributes<HTMLDivElement> {
    error: RenderError
    config: RecetteConfig
    searchContext: SearchContext
}

export default function RecetteError (props: RecetteErrorProps) {
    const [ appState, dispatchAppState ] = useAppState()

    useThemes(appState.settings.theme)

    return (
        <main className='RecetteError'>

            <header>
                <NavBar 
                    searchContext={props.searchContext}
                    appState={appState}
                    dispatchAppState={dispatchAppState}
                />
            </header>

            <div>
                <main>
                    <article>
                        <Block size='medium'>
                            <h1>{props.error.title}</h1>
                        </Block>
                        <Block size='medium'>
                            <p>{props.error.message}</p>
                        </Block>
                        <Block size='medium'>
                            <code>{props.error.status}</code>
                            <br />
                            <code>{props.error.error}</code>
                        </Block>
                    </article>
                    <footer>
                        <PageFooter config={props.config} />
                    </footer>
                </main>
            </div>
            
        </main>
    )
}
