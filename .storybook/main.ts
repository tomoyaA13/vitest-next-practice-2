import type {StorybookConfig} from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    // https://zenn.dev/masatotezuka/articles/strorybook_nextjs_beginner#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89
    // 上記のサイトを参考に stories の設定を変更
    "stories": ["../**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    "addons": [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest"
    ],
    "framework": {
        "name": "@storybook/nextjs-vite",
        "options": {}
    },
    "staticDirs": [
        "../public"
    ]
};
export default config;