import { promises as fs } from 'fs'
import path from 'path'
import { parseRecipe } from '@/markdown/parser'
import { toId, toTitle } from '@/util/strings'
import { sha256 } from '@/util/crypto'

function dirname (str: string) {
    return path.dirname('.') + str
}

export async function fetchRecipeChecksum (category: string, recipe: string) {
    const filePath = dirname(`/recipes/${category}/${recipe}.md`)
    const raw = await fs.readFile(filePath, 'utf8')
    const checksum = await sha256(raw)

    return checksum
}

export async function fetchRecipe (category: string, recipe: string) {
    const filePath = dirname(`/recipes/${category}/${recipe}.md`)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = parseRecipe(raw)

    return { 
        raw, 
        content: parsed.html, 
        attributes: {
            ...parsed.attributes,
            categoryId: category,
        },
    }
}

export async function fetchSearchContext () {
    const taxonomyPaths = await fs.readdir(dirname('/recipes'), 'utf8')

    const authorIds: string[] = []
    let tagIds: string[] = []

    const recipes = (await Promise.all(taxonomyPaths.map(async (taxonomyPath) => {
        const filePath = dirname(`/recipes/${taxonomyPath}`)
        const files = await fs.readdir(filePath, 'utf8')
                
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
                .map((recipe) => ({ 
                    id: recipe.id, 
                    authorId: recipe.authorId, 
                    categoryId: recipe.categoryId 
                } as unknown as RecipeItem))
        }
    })

    const tags: TagItem[] = Array.from(new Set(tagIds)).map((id) => {
        return {
            id,
            recipes: recipes
                .filter((recipe) => recipe.tags.includes(id))
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((recipe) => ({ 
                    id: recipe.id,
                    authorId: recipe.authorId, 
                    categoryId: recipe.categoryId 
                } as unknown as RecipeItem))
        }
    })

    const taxonomies = taxonomyPaths.map((taxonomyPath) => {
        return {
            id: taxonomyPath,
            title: toTitle(taxonomyPath),
            recipes: recipes
                .filter((recipe) => recipe.categoryId === taxonomyPath)
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((recipe) => ({ 
                    id: recipe.id, 
                    authorId: recipe.authorId, 
                    categoryId: recipe.categoryId 
                } as unknown as RecipeItem))
        } as TaxonomyItem
    })

    return { 
        authors, 
        recipes, 
        tags, 
        taxonomies
    }
}

export async function fetchAuthor (searchContext: SearchContext, authorId: string) {
    const recipes = searchContext.recipes
        .filter((recipe) => recipe.authorId === authorId)
        .sort((a, b) => a.title.localeCompare(b.title))

    const author = {
        id: authorId,
        name: toTitle(authorId),
        recipes: recipes.map((recipe) => ({ id: recipe.id } as unknown as RecipeItem))
    }
    
    const taxonomy = {
        id: author.id,
        title: `Recipes by ${author.name}`,
        recipes,
        root: 'author',
        rootTitle: 'All Authors'
    }

    return {
        author,
        taxonomy,
        searchContext
    }
}

export async function fetchCategory (searchContext: SearchContext, categoryId: string) {
    const filePath = dirname(`/recipes/${categoryId}`)
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
                    categoryId,
                    authorId: toId(attributes.author)
                }
            })
    )
    recipes.sort((a, b) => a.title.localeCompare(b.title))

    const taxonomy = {
        id: categoryId,
        title: toTitle(categoryId),
        recipes,
        root: '',
        rootTitle: 'All Recipes'
    }

    return {
        taxonomy,
        searchContext
    }
}

export async function fetchTag (searchContext: SearchContext, tag: string) {
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

    return {
        taxonomy,
        searchContext
    }
}
