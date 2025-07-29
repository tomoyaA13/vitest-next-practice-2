import type { Preview } from '@storybook/nextjs-vite'
import "../src/app/globals.css" // tailwind を使えるようにする (https://zenn.dev/masatotezuka/articles/strorybook_nextjs_beginner#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;