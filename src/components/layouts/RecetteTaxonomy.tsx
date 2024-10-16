import styles from './RecetteTaxonomy.module.sass'

import React, { HTMLAttributes } from 'react'
import Link from 'next/link'

import { forEach, ifElse, ifThen } from '@/util/controlFlow'
import { useAppState } from '@/hooks/useAppState'
import { useThemes } from '@/hooks/useThemes'

import Block from '../Block'
import NavBar from '../NavBar'
import PageFooter from '../PageFooter'

export interface RecetteTaxonomyProps extends HTMLAttributes<HTMLDivElement> {
    taxonomy: TaxonomyItem
    config: RecetteConfig
    searchContext: SearchContext
}

export default function RecetteError (props: RecetteTaxonomyProps) {
    const [ appState, dispatchAppState ] = useAppState()

    useThemes(appState.settings.theme)

    return (
        <main className={styles['RecetteTaxonomy']}>

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
                        {
                            ifThen(typeof props.taxonomy.root === 'string' && props.taxonomy.rootTitle, () => (
                                <Block size='medium'>
                                    <Link href={'/' + props.taxonomy.root} className='text-taxonomy'>{props.taxonomy.rootTitle!}</Link>
                                </Block>
                            ))
                        }
                        <Block size='medium'>
                            <h1>{props.taxonomy.title}</h1>
                        </Block>
                        <Block size='medium'>
                            <ul className={styles['RecetteTaxonomy__List']}>
                                {
                                    ifThen(
                                        props.taxonomy.root === true, 
                                        () => (
                                            <>
                                                {
                                                    forEach(props.searchContext.taxonomies, (taxonomy) => (
                                                        <Link className='panel' href={'/' + taxonomy.id} key={taxonomy.id}>
                                                            <li>
                                                                <h2>{taxonomy.title}</h2>
                                                                <p>
                                                                    <span>{taxonomy.recipes.length}</span>&nbsp;
                                                                    <span>recipes</span>
                                                                </p>
                                                            </li>
                                                        </Link>
                                                    ))
                                                }
                                            </>
                                        )
                                    )
                                }
                                {
                                    ifThen(
                                        props.taxonomy.id === 'tag', 
                                        () => (
                                            <>
                                                {
                                                    forEach(props.searchContext.tags, (taxonomy) => (
                                                        <Link className='panel' href={'/tag/' + taxonomy.id} key={taxonomy.id}>
                                                            <li>
                                                                <h2>{taxonomy.id}</h2>
                                                                <p>
                                                                    <span>{taxonomy.recipes.length}</span>&nbsp;
                                                                    <span>recipes</span>
                                                                </p>
                                                            </li>
                                                        </Link>
                                                    ))
                                                }
                                            </>
                                        )
                                    )
                                }
                                {
                                    ifThen(
                                        props.taxonomy.id === 'author', 
                                        () => (
                                            <>
                                                {
                                                    forEach(props.searchContext.authors, (taxonomy) => (
                                                        <Link className='panel' href={'/author/' + taxonomy.id} key={taxonomy.id}>
                                                            <li>
                                                                <h2>{taxonomy.name}</h2>
                                                                <p>
                                                                    <span>{taxonomy.recipes.length}</span>&nbsp;
                                                                    <span>recipes</span>
                                                                </p>
                                                            </li>
                                                        </Link>
                                                    ))
                                                }
                                            </>
                                        )
                                    )
                                }
                                {
                                    ifThen(
                                        props.taxonomy.root !== true, 
                                        () => (
                                            <>
                                                {
                                                    forEach(props.taxonomy.recipes, (recipe) => (
                                                        <Link className='panel' href={'/' + recipe.categoryId + '/' + recipe.id} key={recipe.id}>
                                                            <li>
                                                                <h2>{recipe.title}</h2>
                                                                <p>{recipe.description}</p>
                                                            </li>
                                                        </Link>
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
