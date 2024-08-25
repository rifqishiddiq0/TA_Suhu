// next
import { Html, Head, Main, NextScript } from 'next/document'
// @chakra
import { ColorModeScript } from '@chakra-ui/react'
// config
import theme from '~/configs/theme'

export default function Document(): JSX.Element {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <Main />

        <NextScript />
      </body>
    </Html>
  )
}
