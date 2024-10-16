import { promises as fs } from 'fs'
import path from 'path'

function dirname (str: string) {
    return path.dirname('.') + str
}

function cleanSvg (svg: string) {
    return svg
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '')
        .replace(/fill="[^"]*"/g, '')
}

export async function fetchIcons () {
    const fileNames = await fs.readdir(dirname('/src/assets/icons'))
    
    const iconNames = fileNames.map(
        (fileName) => fileName.replace('.svg', '')
    )
    
    const iconSvgs = await Promise.all(
        fileNames.map(
            (fileName) => fs.readFile(
                dirname(`/src/assets/icons/${fileName}`), 
                'utf8'
            )
        )
    )
    
    return iconNames.map((iconName, index) => {
        const iconSvg = iconSvgs[index]
    
        return {
            id: iconName,
            svg: cleanSvg(iconSvg),
        }
    })
}
