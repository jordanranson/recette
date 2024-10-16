import type { NextApiRequest, NextApiResponse } from 'next'
import { toTitle } from '@/util/strings'

interface Data {
    taxonomy: TaxonomyItem
    searchContext: SearchContext
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const tag = req.query.tag as string
    const recipes = searchContext.recipes
        .filter((recipe) => recipe.tags.includes(tag))
        .sort((a, b) => a.title.localeCompare(b.title))
    
    const taxonomy = {
        id: tag,
        title: `${'"' + toTitle(tag) + '"'} Recipes`,
        recipes,
        root: 'tag',
        rootTitle: 'All Tags'
    }

    res
        .status(200)
        .json({
            taxonomy,
            searchContext
        })
}
