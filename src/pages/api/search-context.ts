import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { parseRecipe } from '@/markdown/parser'
import { formatTaxonomyTitle } from '@/util/strings'

interface Data {
    recipes: RecipeFragment[]
    taxonomies: Taxonomy[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const taxonomyPaths = (await fs.readdir(path.join(__dirname, '../../../../public/recipes')))

    const recipes = (await Promise.all(taxonomyPaths.map(async (taxonomyPath) => {
        const filePath = path.join(__dirname, '../../../../public/recipes/' + taxonomyPath)
        const files = (await fs.readdir(filePath))
                
        return await Promise.all(
            files.map(async (file) => {
                const raw = await fs.readFile(path.join(filePath, file), 'utf8')
                const { attributes } = parseRecipe(raw)
                return {
                    id: file.replace('.md', ''),
                    title: attributes.title,
                    description: attributes.description,
                    tags: attributes.tags.map(tag => tag.toLowerCase()),
                    categoryId: taxonomyPath
                } as RecipeFragment
            })
        )
    }))).flat()

    const taxonomies = taxonomyPaths.map((taxonomyPath) => {
        return {
            id: taxonomyPath,
            title: formatTaxonomyTitle(taxonomyPath),
            recipes: recipes
                .filter((recipe) => recipe.categoryId === taxonomyPath)
                .map((recipe) => ({ id: recipe.id }))
        } as Taxonomy
    })

    res
        .status(200)
        .json({ recipes, taxonomies })
}
