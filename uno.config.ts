import { defineConfig, presetWind4 } from 'unocss'
import { presetIcons } from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default)
      }
    })
  ]
})