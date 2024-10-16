import { MarkedExtension, marked } from 'marked'

class Markdown {
    public parse (markdown: string) {
        const html = marked.parse(markdown)
        return { html }
    }

    public use (...args: MarkedExtension[]): void {
        marked.use(...args)
    }
}

export const markdown = new Markdown()

marked.use(
    {
        gfm: true,
        extensions: []
    }
)
