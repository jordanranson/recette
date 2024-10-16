import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

import { toId, toTitle } from '@/util/strings'
import { parseRecipe } from '@/markdown/parser'

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

    const category = req.query.category as string
    const filePath = path.join(__dirname, '../../../../../../public/recipes/' + category)
    const files = (await fs.readdir(filePath))

    const recipes: TaxonomyItem[ 'recipes' ] = await Promise.all(
        files
            .map(async (file) => {
                const raw = await fs.readFile(path.join(filePath, file), 'utf8')
                const { attributes } = parseRecipe(raw)
                return {
                    id: file.replace('.md', ''),
                    title: attributes.title,
                    description: attributes.description,
                    tags: attributes.tags.map(tag => tag.toLowerCase()),
                    categoryId: category,
                    authorId: toId(attributes.author)
                }
            })
    )
    recipes.sort((a, b) => a.title.localeCompare(b.title))

    const taxonomy = {
        id: category,
        title: toTitle(category),
        recipes,
        root: '',
        rootTitle: 'All Recipes'
    }

    res
        .status(200)
        .json({
            taxonomy,
            searchContext
        })
}
