import Head from 'next/head'

export default function NotFoundPage () {
  return (
    <>
      <Head>
        <title>Recette</title>
        <meta name='description' content='' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/icon.svg' />
      </Head>
      <div>
        404 Page Not Found
      </div>
    </>
  )
}
