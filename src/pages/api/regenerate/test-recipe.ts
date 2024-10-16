import { fetchRecipeChecksum } from '@/scripts/fetchData'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{
        contentChanged: boolean,
        checksum: string,
    }>
) {
    const categoryId = req.query.categoryId as string
    const recipeId = req.query.recipeId as string

    const prevChecksum = req.query.checksum as string
    const curChecksum = await fetchRecipeChecksum(categoryId, recipeId)

    return res.json({
        contentChanged: prevChecksum !== curChecksum,
        checksum: curChecksum,
    })
}
