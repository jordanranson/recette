export function toTitle (str?: string) {
    if (!str) return ''

    return str
        .replace(/[-._/]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export function toId (str?: string) {
    if (!str) return ''

    return str
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase()
}
