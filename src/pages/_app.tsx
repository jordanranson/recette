import '../../style.css'
import '../styles/index.sass'

import type { AppProps } from 'next/app'
import { Cabin, Playfair_Display } from 'next/font/google'
 
const cabin = Cabin({
    subsets: ['latin'],
    variable: '--font-family',
    display: 'swap',
})

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-family-title',
    display: 'swap',
})

export default function App ({ Component, pageProps }: AppProps) {
    return (
        <div id='main' className={`${cabin.variable} ${playfairDisplay.variable}`}>
            <Component {...pageProps} />
        </div>
    )
}
