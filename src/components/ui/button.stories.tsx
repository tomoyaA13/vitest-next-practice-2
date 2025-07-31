import type {Meta, StoryObj} from '@storybook/nextjs-vite';

import {Button} from './button';
import {fn} from "storybook/test";

const meta = {
    title: 'components/ui/button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            description: 'ボタンの外観バリアント',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: 'ボタンのサイズ',
        },
        asChild: {
            control: 'boolean',
            description: 'Slotコンポーネントとして使用するかどうか',
        },
        disabled: {
            control: 'boolean',
            description: 'ボタンを無効化',
        },
        children: {
            control: 'text',
            description: 'ボタンのコンテンツ',
        },
    },
    args: {
        onClick: fn(),
        children: 'Button',
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なストーリー
export const Default: Story = {
    args: {
        variant: 'default',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: '削除',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'アウトライン',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'セカンダリー',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'ゴースト',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'リンク',
    },
};

// サイズバリエーション
export const Small: Story = {
    args: {
        size: 'sm',
        children: '小さいボタン',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: '大きいボタン',
    },
};

export const Icon: Story = {
    args: {
        size: 'icon',
        children: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
        ),
    },
};

// アイコン付きボタン
export const WithIcon: Story = {
    args: {
        children: (
            <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                </svg>
                ダウンロード
            </>
        ),
    },
};

// 無効状態
export const Disabled: Story = {
    args: {
        disabled: true,
        children: '無効なボタン',
    },
};

// 全バリアントを表示
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
            </div>
        </div>
    ),
};

// 全サイズを表示
export const AllSizes: Story = {
    render: () => (
        <div className="flex gap-2 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </Button>
        </div>
    ),
};

// asChildの使用例
export const AsChild: Story = {
    args: {
        asChild: true,
        children: <a href="https://example.com">リンクとして使用</a>,
    },
};