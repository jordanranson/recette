import { promises as fs } from 'fs'
import path from 'path'

function dirname (str: string) {
    return path.dirname('.') + str
}

async function postBuild () {
    // Copy CNAMME into './docs'
    await fs.copyFile(dirname('/CNAME'), dirname('/out/CNAME'))
}

postBuild()
