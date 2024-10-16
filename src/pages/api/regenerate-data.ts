
import { writeJson } from '@/scripts/writeJson'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: true }>
) {
    await writeJson()
    
    res
        .status(200)
        .json({ ok: true })
}
