/// <reference types="vitest/config" />
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://nextjs.org/docs/app/guides/testing/vitest#manual-setup
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        projects: [{
            extends: true,
            plugins: [
                // The plugin will run tests for the stories defined in your Storybook config
                // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                storybookTest({
                    configDir: path.join(dirname, '.storybook')
                })],
            test: {
                name: 'storybook',
                browser: {
                    enabled: true,
                    headless: true,
                    provider: 'playwright',
                    instances: [{
                        browser: 'chromium'
                    }]
                },
                setupFiles: ['.storybook/vitest.setup.ts']
            }
        }],
        include: ['src/**/*.{test,spec,stories}.{js,ts,jsx,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
        ],
    }
});