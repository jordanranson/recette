// Recipe Types

declare interface RecetteConfig {
    build: {
        baseUrl: string
    },
    template: {
        footerLinks: {
            text: string
            link: string
        }[]
    }
}

declare interface Recipe {
    attributes: RecipeAttributes
    content: string
    raw: string
}

declare interface RecipeIngredient {
    qty: number
    unit: 'cup' | 'tsp' | 'tbsp' | 'oz' | 'g' | 'kg' | 'dash' | 'barspoon' | 'measure' | 'unit'
    name: string
    link?: string
}

declare interface RecipeAttributes {
    title: string
    description: string
    summary: string
    author: string
    tags: string[]
    categoryId?: string
    created: Date
    modified: Date
    yield?: number
    yieldUnit?: string
    servingSize?: number
    caloriesPerServing?: number
    prepTime?: number
    cookTime?: number
    ingredients: RecipeIngredient[] | Record<string, RecipeIngredient[]>
}

declare interface RecipeItem {
    title: string
    description: string
    id: string
    tags: string[]
    categoryId: string
    authorId: string
}



// Search Types

declare interface AuthorItem {
    id: string
    name: string
    recipes: RecipeItem[]
}

declare interface TagItem {
    id: string
    recipes: RecipeItem[]
}

declare interface TaxonomyItem {
    id: string
    title: string
    recipes: RecipeItem[]
    root?: boolean | string
    rootTitle?: string
}

declare interface SearchContext {
    authors: AuthorItem[]
    recipes: RecipeItem[]
    tags: TagItem[]
    taxonomies: TaxonomyItem[]
}



// SSR

declare interface RenderError {
    status: number
    title: string
    message: string
    error: string
}
