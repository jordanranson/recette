// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce (fn: Function, delay: number = 100) {
    let timeout: NodeJS.Timeout | undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, ...args: any[]) {
        const later = () => {
            timeout = undefined
            fn.apply(this, args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, delay)
    }
}
