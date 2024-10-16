import { promises as fs } from 'fs'
import path from 'path'
import { fetchIcons } from './fetchIcons'
import { fetchRecipe, fetchSearchContext, fetchAuthor, fetchCategory, fetchTag } from './fetchData'
import { fetchConfig } from './fetchConfig'

function dirname (str: string) {
    return path.dirname('.') + str
}

async function writeToFile (data: unknown, pathName: string) {
    const parts = pathName.split('/')
    parts.pop()
    const filePath = dirname(parts.join('/'))

    await fs.mkdir(filePath, { recursive: true })
    await fs.writeFile(dirname(pathName),  JSON.stringify(data))
}

export async function writeJson () {
    /*
     * Icons
     */

    const icons = await fetchIcons()
    await writeToFile(icons, '/src/assets/icons.json')

    /*
     * Config
     */
    
    const config = await fetchConfig()
    await writeToFile(config, '/public/data/config.json')

    /*
     * Search Context
     */

    const searchContext = await fetchSearchContext()
    await writeToFile(searchContext, '/public/data/search-context.json')

    /* 
     * Recipes
     */

    await Promise.all(searchContext.recipes.map(async (recipe: RecipeItem) => {
        const data = await fetchRecipe(recipe.categoryId, recipe.id)
        await writeToFile(data, `/public/data/recipe/${recipe.categoryId}/${recipe.id}.json`)
    }))

    /*
     * Taxonomy Data
     */

    const authors = searchContext.authors.map((author: AuthorItem) => author.id)
    await Promise.all(authors.map(async (author) => {
        const data = await fetchAuthor(searchContext, author)
        await writeToFile(data, `/public/data/author/${author}.json`)
    }))

    const categories = searchContext.taxonomies.map((taxonomy: TaxonomyItem) => taxonomy.id)
    await Promise.all(categories.map(async (category) => {
        const data = await fetchCategory(searchContext, category)
        await writeToFile(data, `/public/data/category/${category}.json`)
    }))
    
    const tags = searchContext.tags.map((tag: TagItem) => tag.id)
    await Promise.all(tags.map(async (tag) => {
        const data = await fetchTag(searchContext, tag)
        await writeToFile(data, `/public/data/tag/${tag}.json`)
    }))
}
