import React, { HTMLAttributes, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { forEach, ifThen } from '@/util/controlFlow'
import { AppState, AppStateAction } from '@/hooks/useAppState'

import { JumboSearch } from './controls/JumboSearch'
import { IconButton, IconButtonLink } from './Icon'
import Level from './Level'
import { toTitle } from '@/util/strings'

function useSearch (searchContext: SearchContext, taxonomy?: string, recipeId?: string) {
    const router = useRouter()
    const [ query, setQuery ] = useState('')
    const [ results, setResults ] = useState<RecipeItem[]>([])

    useEffect(() => {
        setQuery('')
        setResults([])
    }, [ router.asPath ])

    useEffect(() => {
        const onSearch = () => {
            const q = query.toLowerCase().trim()

            if (!q || q.length < 3) {
                setResults([])
                return
            }

            const found = searchContext.recipes
                .filter(r => {
                    return (
                        r.title.toLowerCase().includes(q) ||
                        r.description.toLowerCase().includes(q) ||
                        toTitle(r.authorId).toLowerCase().includes(q) ||
                        toTitle(r.categoryId).toLowerCase().includes(q) ||
                        r.tags.reduce((prev, cur) => cur.includes(q) ? true : prev, false)
                    )
                })
                .map(r => {
                    let weight = 0

                    if (r.title.toLowerCase().includes(q)) weight += 4
                    if (r.description.toLowerCase().includes(q)) weight += 3
                    if (toTitle(r.authorId).toLowerCase().includes(q)) weight += 1
                    if (toTitle(r.categoryId).toLowerCase().includes(q)) weight += 1
                    if (r.tags.reduce((prev, cur) => cur.includes(q) ? true : prev, false)) weight += 2

                    return {
                        ...r,
                        weight
                    }
                })
                .sort((a, b) => {
                    if (a.weight - b.weight === 0) {
                        return a.title.localeCompare(b.title)
                    } else {
                        return b.weight - a.weight
                    }
                })
                .slice(0, 5)

            setResults(found)
        }
        onSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ query ])

    const shuffle = () => {
        const found = searchContext.taxonomies.find(t => (t.id === taxonomy))
        
        if (!found) {
            const recipes = searchContext.recipes.filter(r => r.id !== recipeId)
            const index = Math.round(Math.random() * (recipes.length - 1))
            const recipe = recipes[index]
            router.push('/' + recipe.categoryId + '/' + recipe.id)
            return
        }

        const recipes = found.recipes.filter(r => r.id !== recipeId)
        const index = Math.round(Math.random() * (recipes.length - 1))
        const recipe = recipes[index]
        router.push('/' + recipe.categoryId + '/' + recipe.id)
    }

    return {
        results,
        setQuery,
        shuffle,
    }
}

interface NavBarProps extends HTMLAttributes<HTMLDivElement> {
    taxonomy?: string
    recipeId?: string
    searchContext: SearchContext
    appState: AppState
    dispatchAppState: React.Dispatch<AppStateAction>
}

export default function NavBar (props: NavBarProps) {
    const { results, setQuery, shuffle } = useSearch(props.searchContext, props.taxonomy, props.recipeId)

    const onAppearanceChange = () => {
        props.dispatchAppState({
            type: 'TOGGLE_THEME',
        })
    }

    useEffect(() => {
        const onClick = (evt: MouseEvent) => {
            if (!(evt.target as HTMLElement).closest('#searchResults')) {
                setQuery('')
            }
        }

        document.addEventListener('mouseup', onClick)

        return () => {
            document.removeEventListener('mouseup', onClick)
        }
    })

    return (
        <Level size='regular' className='NavBar'>
            <aside>
                <Level size='small'>
                    <IconButtonLink
                        href='/'
                        name='menuBurger'
                    />
                    <IconButton
                        onClick={shuffle}
                        name='shuffle'
                    />
                    {
                        ifThen(
                            props.appState.settings.theme === 'system',
                            () => (
                                <IconButton
                                    onClick={onAppearanceChange}
                                    name='darkMode'
                                />
                            )
                        )
                    }
                    {
                        ifThen(
                            props.appState.settings.theme === 'light',
                            () => (
                                <IconButton
                                    onClick={onAppearanceChange}
                                    name='sun'
                                />
                            ) 
                        )
                    }
                    {
                        ifThen(
                            props.appState.settings.theme === 'dark',
                            () => (
                                <IconButton
                                    onClick={onAppearanceChange}
                                    name='moon'
                                />
                            )
                        )
                    }
                </Level>
            </aside>
            <nav>
                <JumboSearch 
                    onSearch={setQuery}
                />
                {
                    ifThen(results.length > 0, () => (
                        <div id='searchResults' className='panel'>
                            <ul>
                                {
                                    forEach(results, (recipe) => (
                                        <li key={recipe.id}>
                                            <Link href={'/' + recipe.categoryId + '/' + recipe.id}>
                                                <h4>{recipe.title}</h4>
                                                <p>{recipe.description}</p>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </nav>
        </Level>
    )
}
