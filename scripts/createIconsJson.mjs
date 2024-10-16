import { promises as fs } from 'fs'
import path from 'path'

function cleanSvg (svg) {
    return svg
        .replace(/<svg[^>]*>/, '')
        .replace(/<\/svg>/, '')
        .replace(/fill="[^"]*"/g, '')
}

(async function fetchIcons () {
    const fileNames = await fs.readdir(
        path.dirname('.') + '/public/icons'
    )
    
    const iconNames = fileNames.map(
        (fileName) => fileName.replace('.svg', '')
    )
    
    const iconSvgs = await Promise.all(
        fileNames.map(
            (fileName) => fs.readFile(
                path.dirname('.') + '/public/icons/' + fileName, 
                'utf8'
            )
        )
    )
    
    const icons = iconNames.map((iconName, index) => {
        const iconSvg = iconSvgs[index]
    
        return {
            id: iconName,
            svg: cleanSvg(iconSvg),
        }
    })

    await fs.writeFile(
        path.dirname('.') + '/src/assets/icons.json',
        JSON.stringify(icons)
    )
})()
