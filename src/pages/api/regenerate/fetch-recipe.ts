import { fetchRecipe } from '@/scripts/fetchData'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Recipe>
) {
    const categoryId = req.query.categoryId as string
    const recipeId = req.query.recipeId as string
    const recipe = await fetchRecipe(categoryId, recipeId)

    return res.json(recipe)
}
