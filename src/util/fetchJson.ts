import { promises as fs } from 'fs'
import path from 'path'

function dirname (str: string) {
    return path.dirname('.') + str
}

export async function fetchJson <T> (filePath: string) {
    filePath = dirname(`/public/data${filePath}.json`)
    const raw = await fs.readFile(filePath, 'utf8')

    return JSON.parse(raw) as T
}
