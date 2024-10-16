import type { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import RecipeMeta from '@/components/meta/RecipeMeta'
import RecetteRecipe from '@/components/layouts/RecetteRecipe'
import { fetchJson } from '@/util/fetchJson'
 
interface StaticProps {
    recipe: Recipe
    config: RecetteConfig
    searchContext: SearchContext
}

export const getStaticPaths = (async () => {
    const searchContext: SearchContext = await fetchJson('/search-context')

    return {
        paths: searchContext.recipes.map((recipe) => ({ params: {
            category: recipe.categoryId,
            recipe: recipe.id
        } })),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    const config: RecetteConfig = await fetchJson('/config')
    const searchContext: SearchContext = await fetchJson('/search-context')
    const recipe: Recipe = await fetchJson('/recipe/' + context.params!.category + '/' + context.params!.recipe)

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
