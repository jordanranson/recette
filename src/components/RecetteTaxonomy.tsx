import './RecetteTaxonomy.sass'

import React, { HTMLAttributes } from 'react'

import { forEach, ifElse } from '../../util/controlFlow'
import { useAppState } from '../hooks/useAppState'
import { useThemes } from '../hooks/useThemes'

import Block from './Block'
import NavBar from './NavBar'
import PageFooter from './PageFooter'

export interface RecetteTaxonomyProps extends HTMLAttributes<HTMLDivElement> {
    taxonomy: Taxonomy
    config: RecetteConfig
    searchContext: SearchContext
}

export default function RecetteError (props: RecetteTaxonomyProps) {
    const [ appState, dispatchAppState ] = useAppState()

    useThemes(appState.settings.theme)

    return (
        <main className='RecetteTaxonomy'>

            <header>
                <NavBar 
                    taxonomy={props.taxonomy.id}
                    searchContext={props.searchContext} 
                    appState={appState}
                    dispatchAppState={dispatchAppState}
                />
            </header>

            <div>
                <main>
                    <article>
                        <Block size='medium'>
                            <h1>{props.taxonomy.title}</h1>
                        </Block>
                        <Block size='medium'>
                            <ul className='RecetteTaxonomy__List'>
                                {
                                    ifElse(
                                        props.taxonomy.root, 
                                        () => (
                                            <>
                                                {
                                                    forEach(props.searchContext.taxonomies, (taxonomy) => (
                                                        <a className='panel' href={'/' + taxonomy.path} key={taxonomy.path}>
                                                            <li>
                                                                <h2>{taxonomy.title}</h2>
                                                                <p>
                                                                    <span>{taxonomy.recipes.length}</span>&nbsp;
                                                                    <span>recipes</span>
                                                                </p>
                                                            </li>
                                                        </a>
                                                    ))
                                                }
                                            </>
                                        ), 
                                        () => (
                                            <>
                                                {
                                                    forEach(props.taxonomy.recipes, (recipe) => (
                                                        <a className='panel' href={'/' + recipe.path} key={recipe.path}>
                                                            <li>
                                                                <h2>{recipe.title}</h2>
                                                                <p>{recipe.description}</p>
                                                            </li>
                                                        </a>
                                                    ))
                                                }
                                            </>
                                        )
                                    )
                                }
                            </ul>
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
