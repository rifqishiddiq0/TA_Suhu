import { extendTheme } from '@chakra-ui/react'

// theme config
import config from './config'

// color palette override
import colors from './colors'

// global style overrides
import styles from './styles'

// foundational style overrides
import foundations from './foundations'

// component style overrides
import components from './components'

const overrides = {
  config,
  colors,
  styles,
  // Other foundational style overrides go here
  ...foundations,
  // Other components go here
  components
}

export default extendTheme(overrides)
