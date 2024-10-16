export function capitalize (str: string) {
    return str
        .replace(/_/g, ' ')
        .split(' ')
        .map(
            str => str
                .charAt(0)
                .toUpperCase() + str.slice(1)
        )
        .join(' ')
}

export function formatTaxonomyTitle (path: string) {
    return path
        .replace(/[-._/]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}
