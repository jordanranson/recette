import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { parseRecipe } from '@/markdown/parser'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Recipe>,
) {
    const filePath = path.join(
        __dirname, 
        '../../../../../../public/recipes/', 
        req.query.category + '/' + req.query.recipe + '.md'
    )
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = parseRecipe(raw)

    res
        .status(200)
        .json({ 
            raw, 
            content: parsed.html, 
            attributes: {
                ...parsed.attributes,
                categoryId: req.query.category as string,
            },
        })
}
