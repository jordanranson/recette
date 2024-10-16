import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import RecipeMeta from '@/components/meta/RecipeMeta'
import RecetteRecipe from '@/components/layouts/RecetteRecipe'
 
interface StaticProps {
    recipe: Recipe
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async (context) => {
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    return {
        paths: searchContext.recipes.map((recipe) => ({ params: {
            category: recipe.categoryId,
            recipe: recipe.id
        } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    let config: RecetteConfig = {} as any
    {
        const res = await fetch('http://localhost:3000/api/config')
        config = await res.json()
    }

    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }
    
    let recipe: Recipe = {} as any
    {
        const res = await fetch('http://localhost:3000/api/recipe/' + context.params!.category + '/' + context.params!.recipe)
        recipe = await res.json()
    }

    return { 
        props: { 
            recipe,
            config,
            searchContext
        } 
    }
}) satisfies GetStaticProps<StaticProps>

export default function RecipePage (props: StaticProps) {
    const router = useRouter()
    
    return (
        <>
            <RecipeMeta
                path={router.asPath}
                attributes={props.recipe.attributes} 
            />
            <RecetteRecipe
                recipe={props.recipe}
                config={props.config}
                searchContext={props.searchContext}
            />
        </>
    )
}
