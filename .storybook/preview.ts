import type { Preview } from '@storybook/nextjs-vite'
import "../src/app/globals.css" // tailwind を使えるようにする (https://zenn.dev/masatotezuka/articles/strorybook_nextjs_beginner#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
import { initialize, mswLoader } from 'msw-storybook-addon';

// https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests
/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

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
  // https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
};

export default preview;