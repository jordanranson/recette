export function debounce (fn: Function, delay: number = 100) {
    let timeout: NodeJS.Timeout | undefined

    return function (this: any, ...args: any[]) {
        const later = () => {
            timeout = undefined
            fn.apply(this, args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, delay)
    }
}
