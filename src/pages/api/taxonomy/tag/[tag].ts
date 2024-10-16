import type { NextApiRequest, NextApiResponse } from 'next'
import { formatTaxonomyTitle } from '@/util/strings'

interface Data {
    taxonomy: Taxonomy
    searchContext: SearchContext
}

interface Error {
    status: number
    title: string
    message: string
    error: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | RenderError>,
) {
    let searchContext: SearchContext = {} as any
    {
        const res = await fetch('http://localhost:3000/api/search-context')
        searchContext = await res.json()
    }

    const tag = req.query.tag as string
    const recipes = searchContext.recipes.filter((recipe) => recipe.tags.includes(tag))

    if (!recipes.length) {
        return res
            .status(404)
            .json({ 
                status: 404,
                title: 'Tag Not Found',
                message: 'The tag could not be found.',
                error: ''
            })
    }
    
    const taxonomy = {
        id: tag,
        title: `${'"' + formatTaxonomyTitle(tag) + '"'} Recipes`,
        recipes,
    }

    res
        .status(200)
        .json({
            taxonomy,
            searchContext
        })
}
