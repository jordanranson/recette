import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import RecetteTaxonomy from '@/components/RecetteTaxonomy'
 
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
  return (
    <>
        <Head>
            <title>Recette</title>
            <meta name='description' content='' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <link rel='icon' href='/icon.svg' />
        </Head>
        {/* <RecetteTaxonomy
            taxonomy={props.taxonomy}
            config={props.config}
            searchContext={props.searchContext}
        /> */}
        <div>
            <pre>{JSON.stringify(props.recipe, null, 4)}</pre>
            <pre>{JSON.stringify(props.config, null, 4)}</pre>
            <pre>{JSON.stringify(props.searchContext, null, 4)}</pre>
        </div>
    </>
  )
}
