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



// SSR

declare interface RenderError {
    status: number
    title: string
    message: string
    error: string
}

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
