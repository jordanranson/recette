import yaml from 'js-yaml'
import { markdown } from '.'

export function splitRecipeParts (recipe: string): [ yaml: string, markdown: string ] {
    recipe = recipe.trim().replace(/\r/g, '')

    const parts = recipe.match(/^---\n(?:.*|\n)*?\n---/g)

    if (parts === null) {
        throw new Error('Invalid recipe format.')
    }

    return [ 
        parts[0], 
        recipe.replace(parts[0], '').trim()
    ]
}

export function parseAttributesFromYaml (yamlString: string) {
    let attributes: RecipeAttributes
    try {
        attributes = yaml.load(
            yamlString
                .replace(/^---\n/, '')
                .replace(/\n---$/, '')
        ) as RecipeAttributes

        attributes.tags = (attributes.tags as unknown as string)
            .split(',')
            .map(tag => tag.trim())

        attributes.summary = markdown.parse(attributes.summary).html
    } catch (err) {
        throw err
    }

    const requiredKeys = [
        'title',
        'summary',
        'author',
        'tags',
        'created',
        'modified',
        // 'yield',
        // 'yieldUnit',
        // 'servingSize',
        // 'caloriesPerServing',
        // 'prepTime',
        // 'cookTime',
        'ingredients',
    ]

    const missingKeys = requiredKeys.filter(key => !(key in attributes))

    if (missingKeys.length > 0) {
        throw new Error(`Missing required keys: ${missingKeys.join(', ')}`)
    }

    return attributes
}

export function parseContentFromMarkdown (markdownString: string) {
    let html = ''
    
    try {
        const result = markdown.parse(markdownString)
        html = result.html.replace(/\r/g, '')
    } catch (err) {
        throw err
    }

    return { html }
}

export function parseRecipe (recipe: string) {
    const parts = splitRecipeParts(recipe)
    
    const attributes = parseAttributesFromYaml(parts[0])
    const { html } = parseContentFromMarkdown(parts[1])

    return {
        attributes,
        html,
    }
}
