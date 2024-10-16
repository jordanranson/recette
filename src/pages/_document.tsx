import { Html, Head, Main, NextScript } from 'next/document'
import icons from '../assets/icons.json'

export default function Document () {
    const symbols = icons.map((icon: { id: string, svg: string }) => {
        return (
            <symbol 
                id={icon.id}
                key={icon.id}
                viewBox='0 0 16 16' 
                width='16' height='16'
                dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
        )
    })

  return (
    <Html lang='en'>
        <Head />
        <body>
            <svg 
                xmlns='http://www.w3.org/2000/svg' 
                xmlnsXlink='http://www.w3.org/1999/xlink' 
                style={{ display: 'none' }}
            >
                <defs>
                    {symbols}
                </defs>
            </svg>
            <Main />
            <NextScript />
        </body>
    </Html>
  )
}
