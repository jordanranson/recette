import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>,
) {
    const filePath = path.join(__dirname, '../../../../recette.config.json')
    const config = await fs.readFile(filePath, 'utf8')

    res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .send(config)
}
