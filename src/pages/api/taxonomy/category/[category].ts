import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { formatTaxonomyTitle } from '@/util/strings'
import { parseRecipe } from '@/markdown/parser'

interface Data {
    taxonomy: Taxonomy
    searchContext: SearchContext
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

    const category = req.query.category as string
    const filePath = path.join(__dirname, '../../../../../../public/recipes/' + category)
    const files = (await fs.readdir(filePath))

    const recipes: Taxonomy[ 'recipes' ] = await Promise.all(
        files.map(async (file) => {
            const raw = await fs.readFile(path.join(filePath, file), 'utf8')
            const { attributes } = parseRecipe(raw)
            return {
                id: file.replace('.md', ''),
                title: attributes.title,
                description: attributes.description,
                tags: attributes.tags.map(tag => tag.toLowerCase()),
                categoryId: category
            }
        })
    )

    const taxonomy = {
        id: category,
        title: formatTaxonomyTitle(category),
        recipes,
    }

    res
        .status(200)
        .json({
            taxonomy,
            searchContext
        })
}
