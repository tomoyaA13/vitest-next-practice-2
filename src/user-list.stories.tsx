import {Meta, StoryObj} from "@storybook/nextjs-vite";
import {delay, http, HttpResponse} from 'msw';
import {UserList} from "@/components/user-list";
import {errorHandlers, handlers as defaultHandlers, mockUsers, specialHandlers} from '../src/mocks/handlers';
import {expect, within, userEvent, waitFor} from 'storybook/test';

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
    play: async ({ canvas, step }) => {
        // ローディング状態の確認
        await step('ローディング中のスケルトンが表示される', async () => {
            const skeletons = canvas.getAllByRole('status');
            await expect(skeletons).toHaveLength(3);
        });

        // データ取得後の確認
        await step('ユーザーデータが表示される', async () => {
            // ユーザー名が表示されるまで待機
            await waitFor(async () => {
                await expect(canvas.getByText('山田太郎')).toBeInTheDocument();
            });

            // 全ユーザーの情報が表示されていることを確認
            await expect(canvas.getByText('山田太郎')).toBeInTheDocument();
            await expect(canvas.getByText('yamada@example.com')).toBeInTheDocument();
            await expect(canvas.getByText('鈴木花子')).toBeInTheDocument();
            await expect(canvas.getByText('suzuki@example.com')).toBeInTheDocument();
        });
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
    play: async ({ canvas }) => {
        // スケルトンローダーが表示されていることを確認
        const skeletons = canvas.getAllByRole('status');
        await expect(skeletons).toHaveLength(3);
        
        // 各スケルトンが適切なクラスを持っていることを確認
        skeletons.forEach((skeleton) => {
            expect(skeleton).toHaveClass('h-20', 'w-full');
        });
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
    play: async ({ canvas, step }) => {
        await step('エラーメッセージが表示される', async () => {
            // エラーメッセージが表示されるまで待機
            await waitFor(async () => {
                const errorMessage = canvas.getByText(/エラー:/);
                await expect(errorMessage).toBeInTheDocument();
            });

            // エラーメッセージの内容を確認
            const errorMessage = canvas.getByText(/エラー:/);
            await expect(errorMessage).toHaveClass('text-red-500');
            await expect(errorMessage).toHaveTextContent('エラー: Failed to fetch users');
        });
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
    play: async ({ canvas }) => {
        // データが表示されるまで待機
        await waitFor(async () => {
            await expect(canvas.getByText('山田太郎')).toBeInTheDocument();
        });

        // モバイルビューでも全ての要素が表示されていることを確認
        await expect(canvas.getByText('山田太郎')).toBeVisible();
        await expect(canvas.getByText('鈴木花子')).toBeVisible();
    },
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
    play: async ({ canvas }) => {
        // カスタムヘッダーが表示されていることを確認
        const header = canvas.getByText('ユーザー管理');
        await expect(header).toBeInTheDocument();
        await expect(header).toHaveClass('text-2xl', 'font-bold', 'text-primary');

        // ユーザーデータが表示されるまで待機
        await waitFor(async () => {
            await expect(canvas.getByText('山田太郎')).toBeInTheDocument();
        });
    },
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
                    <div className="max-h-[600px] overflow-y-auto p-4" data-testid="user-list-container">
                        <Story/>
                    </div>
                </div>
            </div>
        ),
    ],
    play: async ({ canvas, step }) => {
        await step('大量のユーザーデータが表示される', async () => {
            // 最初のユーザーが表示されるまで待機
            await waitFor(async () => {
                await expect(canvas.getByText('ユーザー 1')).toBeInTheDocument();
            });

            // 100人分のユーザーが存在することを確認
            const userCards = canvas.getAllByRole('article');
            await expect(userCards).toHaveLength(100);
        });

        await step('スクロール可能なコンテナであることを確認', async () => {
            const container = canvas.getByTestId('user-list-container');
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            // スクロールが必要な高さであることを確認
            await expect(scrollHeight).toBeGreaterThan(clientHeight);
        });

        await step('最後のユーザーまでスクロール', async () => {
            const container = canvas.getByTestId('user-list-container');
            
            // 最後までスクロール
            container.scrollTop = container.scrollHeight;
            
            // 最後のユーザーが表示されていることを確認
            await waitFor(async () => {
                await expect(canvas.getByText('ユーザー 100')).toBeInTheDocument();
            });
        });
    },
};