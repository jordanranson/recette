import styles from './RecetteRecipe.module.sass'

import React, { HTMLAttributes } from 'react'
import { useRouter } from 'next/router'

import { useAppState } from '@/hooks/useAppState'
import { useThemes } from '@/hooks/useThemes'
import { useRecipeRerender } from '@/hooks/useRecipeRerender'

import Block from '../Block'
import NavBar from '../NavBar'
import PageFooter from '../PageFooter'
import RecipeSummary from '../RecipeSummary'
import RecipeIngredients from '../RecipeIngredients'
import RecipeContent from '../RecipeContent'

export interface RecetteProps extends HTMLAttributes<HTMLDivElement> {
    checksum: string
    recipe: Recipe
    config: RecetteConfig
    searchContext: SearchContext
}

export default function Recette (props: RecetteProps) {
    const router = useRouter()
    const [ appState, dispatchAppState ] = useAppState(props.recipe)

    useThemes(appState.settings.theme)

    const parts = router.asPath.split('/')
    const recipeId = parts.pop() as string
    const categoryId = parts.pop() as string
    useRecipeRerender(props.checksum, categoryId, recipeId)

    return (
        <div className={styles['RecetteRecipe']}>

            <header>
                <NavBar 
                    taxonomy={appState.recipe.attributes.categoryId}
                    searchContext={props.searchContext} 
                    appState={appState}
                    dispatchAppState={dispatchAppState}
                />
            </header>

            <div>
                <main>
                    <article>
                        <Block size='medium'>
                            <RecipeSummary
                                attributes={appState.recipe.attributes}
                            />
                        </Block>
                        <hr />
                        <Block size='medium'>
                            <RecipeIngredients
                                attributes={appState.recipe.attributes}
                            />
                        </Block>
                        <hr />
                        <Block size='medium'>
                            <RecipeContent
                                content={appState.recipe.content}
                            />
                        </Block>
                    </article>
                    <footer>
                        <PageFooter config={props.config} />
                    </footer>
                </main>
            </div>
            
        </div>
    )
}
