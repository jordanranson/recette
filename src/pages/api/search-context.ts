import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

import { parseRecipe } from '@/markdown/parser'
import { toId, toTitle } from '@/util/strings'

interface Data {
    authors: AuthorItem[]
    recipes: RecipeItem[]
    tags: TagItem[]
    taxonomies: TaxonomyItem[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const taxonomyPaths = (await fs.readdir(path.join(__dirname, '../../../../public/recipes')))

    let authorIds: string[] = []
    let tagIds: string[] = []

    const recipes = (await Promise.all(taxonomyPaths.map(async (taxonomyPath) => {
        const filePath = path.join(__dirname, '../../../../public/recipes/' + taxonomyPath)
        const files = (await fs.readdir(filePath))
                
        return await Promise.all(
            files.map(async (file) => {
                const raw = await fs.readFile(path.join(filePath, file), 'utf8')
                const { attributes } = parseRecipe(raw)

                authorIds.push(toId(attributes.author))
                tagIds = tagIds.concat(attributes.tags.map(tag => toId(tag)))

                return {
                    id: file.replace('.md', ''),
                    title: attributes.title,
                    description: attributes.description,
                    tags: attributes.tags.map(tag => tag.toLowerCase()),
                    categoryId: taxonomyPath,
                    authorId: toId(attributes.author)
                } as RecipeItem
            })
        )
    }))).flat()

    const authors: AuthorItem[] = Array.from(new Set(authorIds)).map((id) => {
        return {
            id,
            name: toTitle(id),
            recipes: recipes
                .filter((recipe) => recipe.authorId === id)
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((recipe) => ({ id: recipe.id, authorId: recipe.authorId, categoryId: recipe.categoryId } as any))
        }
    })

    const tags: TagItem[] = Array.from(new Set(tagIds)).map((id) => {
        return {
            id,
            recipes: recipes
                .filter((recipe) => recipe.tags.includes(id))
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((recipe) => ({ id: recipe.id, authorId: recipe.authorId, categoryId: recipe.categoryId } as any))
        }
    })

    const taxonomies = taxonomyPaths.map((taxonomyPath) => {
        return {
            id: taxonomyPath,
            title: toTitle(taxonomyPath),
            recipes: recipes
                .filter((recipe) => recipe.categoryId === taxonomyPath)
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((recipe) => ({ id: recipe.id, authorId: recipe.authorId, categoryId: recipe.categoryId } as any))
        } as TaxonomyItem
    })

    res
        .status(200)
        .json({ authors, recipes, tags, taxonomies })
}
