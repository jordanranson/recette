import type { NextApiRequest, NextApiResponse } from 'next'
import { toTitle } from '@/util/strings'

interface Data {
    author: AuthorItem
    taxonomy: TaxonomyItem
    searchContext: SearchContext
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    let searchContext: SearchContext
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const recipes = searchContext.recipes
        .filter((recipe) => recipe.authorId === req.query.author)
        .sort((a, b) => a.title.localeCompare(b.title))

    const author = {
        id: req.query.author as string,
        name: toTitle(req.query.author as string),
        recipes: recipes.map((recipe) => ({ id: recipe.id } as unknown as RecipeItem))
    }
    
    const taxonomy = {
        id: author.id,
        title: `Recipes by ${author.name}`,
        recipes,
        root: 'author',
        rootTitle: 'All Authors'
    }

    res
        .status(200)
        .json({
            author,
            taxonomy,
            searchContext
        })
}
