import {Meta, StoryObj} from "@storybook/nextjs-vite";
import {delay, http, HttpResponse} from 'msw';
import {UserList} from "@/components/user-list";
import {errorHandlers, handlers as defaultHandlers, mockUsers, specialHandlers} from '../src/mocks/handlers'

const meta = {
    title: 'components/user-list',
    component: UserList,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'APIからユーザー一覧を取得して表示するコンポーネント',
            },
        },
    },
    tags: ['autodocs'],
    // Tailwind CSSクラスを使用したデコレーター
    decorators: [
        (Story) => (
            <div className="max-w-2xl mx-auto p-4">
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なストーリー
export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '正常にユーザーリストを取得して表示する例（山田太郎、鈴木花子）',
            },
        },
        msw: {
            handlers: defaultHandlers
        },
    },
};

// ローディング状態
export const Loading: Story = {
    parameters: {
        docs: {
            description: {
                story: 'データ取得中のローディング状態を表示',
            },
        },
        msw: {
            handlers: [
                http.get('/api/users', async () => {
                    await delay('infinite');
                    return HttpResponse.json(mockUsers);
                }),
            ],
        },
    },
};

// エラー状態
export const Error: Story = {
    parameters: {
        docs: {
            description: {
                story: 'APIエラー時のエラーメッセージ表示（500エラー）',
            },
        },
        msw: {
            handlers: [errorHandlers.serverError],
        },
    },
};

// レスポンシブデザインの確認
export const Responsive: Story = {
    parameters: {
        docs: {
            description: {
                story: '異なる画面サイズでの表示確認',
            },
        },
        msw: {
            handlers: defaultHandlers,
        },
        viewport: {
            viewports: {
                mobile: {
                    name: 'Mobile',
                    styles: {
                        width: '375px',
                        height: '667px',
                    },
                },
                tablet: {
                    name: 'Tablet',
                    styles: {
                        width: '768px',
                        height: '1024px',
                    },
                },
                desktop: {
                    name: 'Desktop',
                    styles: {
                        width: '1280px',
                        height: '800px',
                    },
                },
            },
            defaultViewport: 'mobile',
        },
    },
    // Tailwindのレスポンシブクラスを使用
    decorators: [
        (Story) => (
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-sm sm:max-w-md lg:max-w-2xl">
                    <Story/>
                </div>
            </div>
        ),
    ],
};

// ダークモード対応
export const DarkMode: Story = {
    parameters: {
        docs: {
            description: {
                story: 'ダークモードでの表示確認',
            },
        },
        msw: {
            handlers: defaultHandlers,
        },
        backgrounds: {
            default: 'dark',
            values: [
                {name: 'light', value: '#ffffff'},
                {name: 'dark', value: '#1a1a1a'},
            ],
        },
    },
    // Tailwindのダークモードクラスを使用
    decorators: [
        (Story) => (
            <div className="dark min-h-[400px] bg-background p-6">
                <div className="mx-auto max-w-2xl">
                    <Story/>
                </div>
            </div>
        ),
    ],
};

// カスタムテーマの例
export const CustomTheme: Story = {
    parameters: {
        docs: {
            description: {
                story: 'カスタムテーマカラーを使用した表示例',
            },
        },
        msw: {
            handlers: defaultHandlers,
        },
    },
    decorators: [
        (Story) => (
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-lg">
                <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-primary mb-4">ユーザー管理</h2>
                    <Story/>
                </div>
            </div>
        ),
    ],
};


// 大量データ表示（スクロール対応）
export const ManyUsers: Story = {
    parameters: {
        docs: {
            description: {
                story: '100人のユーザーを表示する例（スクロール確認用）',
            },
        },
        msw: {
            handlers: [
                http.get('/api/users', () => {
                    const manyUsers = Array.from({length: 100}, (_, i) => ({
                        id: i + 1,
                        name: `ユーザー ${i + 1}`,
                        email: `user${i + 1}@example.com`,
                    }));
                    return HttpResponse.json(manyUsers);
                }),
            ],
        },
    },
    decorators: [
        (Story) => (
            <div className="max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-lg shadow-sm">
                    <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
                        <h2 className="text-xl font-semibold">ユーザー一覧（100件）</h2>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto p-4">
                        <Story/>
                    </div>
                </div>
            </div>
        ),
    ],
};