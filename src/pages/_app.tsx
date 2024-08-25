// next
import { type AppProps } from 'next/app'
// @chakra
import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react'
// configs
import theme from '~/configs/theme'
import { COLOR_MODE_MANAGER_KEY } from '~/configs/chakra'
// luxon
import { Settings } from 'luxon'

// --------------------------------------------------------------------------------------------

const colorModeManager = createLocalStorageManager(COLOR_MODE_MANAGER_KEY)

// luxon locale and timezone config
Settings.defaultLocale = 'id'

// --------------------------------------------------------------------------------------------

type AppPropsWithLayout = AppProps & {
  Component: {
    getLayout?: (page: React.ReactNode) => JSX.Element
  }
}

export default function App({
  Component,
  pageProps
}: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChakraProvider
      theme={theme}
      colorModeManager={colorModeManager}
    >
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  )
}
