import './NavBar.sass'

import React, { HTMLAttributes, useEffect, useState } from 'react'
import { JumboSearch } from './controls/JumboSearch'
import { IconButton, IconButtonLink } from './Icon'
import { forEach, ifElse, ifThen } from '../../util/controlFlow'
import Level from './Level'
import { AppState, AppStateAction } from '../hooks/useAppState'

function useSearch (searchContext: SearchContext, taxonomy?: string) {
    const [ query, setQuery ] = useState('')
    const [ results, setResults ] = useState<RecipeFragment[]>([])

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
                        r.categoryId?.toLowerCase().includes(q) ||
                        r.tags.reduce((prev, cur) => {
                            if (cur.includes(q)) return true
                            return prev
                        }, false)
                    )
                })
                .map(r => {
                    let weight = 0

                    if (r.title.toLowerCase().includes(q)) weight += 4
                    if (r.description.toLowerCase().includes(q)) weight += 3
                    if (r.categoryId?.toLowerCase().includes(q)) weight += 1
                    if (r.tags.reduce((prev, cur) => {
                        if (cur.includes(q)) return true
                        return prev
                    }, false)) weight += 2

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
    }, [ query ])

    const shuffle = () => {
        let found = searchContext.taxonomies.find(t => t.id === taxonomy)
        
        if (!found) {
            const index = Math.round(Math.random() * (searchContext.recipes.length - 1))
            const recipe = searchContext.recipes[index]
            window.location.href = '/' + recipe.id
            return
        }

        const index = Math.round(Math.random() * (found.recipes.length - 1))
        const recipe = found.recipes[index]
        window.location.href = '/' + recipe.id
    }

    return {
        results,
        setQuery,
        shuffle,
    }
}

interface NavBarProps extends HTMLAttributes<HTMLDivElement> {
    taxonomy?: string
    searchContext: SearchContext
    appState: AppState
    dispatchAppState: React.Dispatch<AppStateAction>
}

export default function NavBar (props: NavBarProps) {
    const { results, setQuery, shuffle } = useSearch(props.searchContext, props.taxonomy)

    const [ theme, setTheme ] = useState(props.appState.settings.theme)
    useEffect(() => {
        if (props.appState.settings.theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        } else {
            setTheme(props.appState.settings.theme)
        }
    }, [ props.appState.settings.theme ])

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
        <div className='NavBar'>
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
                                        <li key={recipe.path}>
                                            <a href={'/' + recipe.path}>
                                                <h4>{recipe.title}</h4>
                                                <p>{recipe.description}</p>
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </nav>
            <aside>
                {
                    ifElse(
                        theme === 'dark',
                        () => (
                            <IconButton
                                onClick={onAppearanceChange}
                                name='moon'
                            />
                        ),
                        () => (
                            <IconButton
                                onClick={onAppearanceChange}
                                name='sun'
                            />
                        ) 
                    )
                }
            </aside>
        </div>
    )
}
