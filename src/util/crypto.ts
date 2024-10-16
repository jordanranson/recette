async function sha (text: string, algorithm: string) {
    const msgBuffer = new TextEncoder().encode(text)
    const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer)
    
    return Array
        .from(new Uint8Array(hashBuffer))
        .map(b => ('00' + b.toString(16)).slice(-2))
        .join('')
}

export async function sha1 (text: string) {
    return await sha(text, 'SHA-1')
}

export async function sha256 (text: string) {
    return await sha(text, 'SHA-256')
}
