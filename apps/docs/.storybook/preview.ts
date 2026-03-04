import type { Preview } from '@storybook/react'
import { createElement } from 'react'
import { ThemeProvider } from '@forgeui/components/ThemeProvider'
import { TooltipProvider } from '@forgeui/components'
import '@forgeui/tokens/tokens.css'
import '../styles/base-import.css'

import type { Palette, Mode } from '@forgeui/tokens'

const preview: Preview = {
  globalTypes: {
    palette: {
      description: 'ForgeUI color palette',
      toolbar: {
        title: 'Palette',
        icon: 'paintbrush',
        items: [
          { value: 'midnight-forge-v2', title: 'Midnight Forge v2 (default)' },
          { value: 'hearth-bronze', title: 'Hearth Bronze' },
          { value: 'midnight-forge', title: 'Midnight Forge' },
          { value: 'deep-space', title: 'Deep Space' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'moon',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    palette: 'midnight-forge-v2',
    mode: 'dark',
  },
  decorators: [
    (Story, context) => {
      const palette = (context.globals['palette'] ?? 'midnight-forge-v2') as Palette
      const mode = (context.globals['mode'] ?? 'dark') as Mode
      return createElement(ThemeProvider, {
        palette,
        mode,
        children: createElement(
          TooltipProvider,
          null,
          createElement(
            'div',
            {
              style: {
                backgroundColor: 'var(--forge-bg)',
                padding: '1rem',
                boxSizing: 'border-box',
              },
            },
            createElement(Story),
          ),
        ),
      })
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    a11y: {
      // Run axe on every story automatically
      element: '#storybook-root',
      config: {},
      options: {},
    },
    backgrounds: {
      // Disable Storybook's built-in backgrounds — ThemeProvider handles this
      disable: true,
    },
  },
}

export default preview
