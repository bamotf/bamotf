// @ts-expect-error - this is a hack to get around the fact that the tailwind config is not a
// valid typescript module
import sharedConfig from 'tailwind-config/tailwind.config.js'

import type {Config} from 'tailwindcss'

export default {
  presets: [sharedConfig],
  // @ts-expect-error - sharedConfig is not a valid typescript module
} satisfies Config
