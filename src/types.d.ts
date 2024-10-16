// Web Component Types

declare type CustomEvents<K extends string> = { 
    [key in K] : (event: CustomEvent) => void 
}

declare type CustomElement<T, K extends string> = 
    Partial<T & DOMAttributes<T> & 
    { children: any } & 
    { name: string } & CustomEvents<`on${K}`>>


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
    unit: 'cup' | 'tsp' | 'tbsp' | 'oz' | 'g' | 'kg'
    name: string
    link?: string
}

declare interface RecipeAttributes {
    title: string
    description: string
    summary: string
    version: string
    author: string
    authorLink: string
    tags: string[]
    taxonomy?: string
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


// SSR

declare interface RenderError {
    status: number
    title: string
    message: string
    error: string
}

declare interface RecipeFragment {
    title: string
    description: string
    id: string
    tags: string[]
    categoryId?: string
}

declare interface Taxonomy {
    id: string
    title: string
    root?: boolean
    recipes: RecipeFragment[]
}

declare interface SearchContext {
    recipes: RecipeFragment[]
    taxonomies: Taxonomy[]
}
