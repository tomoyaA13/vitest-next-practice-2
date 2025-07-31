/**
 * 非同期処理を含むコンポーネントのStorybookファイル
 *
 * このファイルでは、APIからデータを取得するコンポーネントのストーリーを
 * MSW（Mock Service Worker）を使って作成する方法を説明します。
 *
 * ■ MSWとは？
 * MSW（Mock Service Worker）は、Service Workerを使ってネットワークリクエストを
 * インターセプト（横取り）し、モックレスポンスを返すライブラリです。
 * これにより、実際のAPIサーバーがなくても、APIとの通信をシミュレートできます。
 *
 * ■ なぜ既存のハンドラーを再利用するのか？
 * - コードの重複を避ける（DRY原則）
 * - テストとStorybookで同じモックデータを使用することで一貫性を保つ
 * - ハンドラーの変更が必要な場合、一箇所（handlers.ts）を修正するだけで済む
 * - チーム全体で同じモックデータを共有できる
 *
 * https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests
 */

import {Meta, StoryObj} from "@storybook/nextjs-vite";
import {delay, http, HttpResponse} from 'msw';
import {UserList} from "@/components/user-list";
import {errorHandlers, handlers as defaultHandlers, mockUsers, specialHandlers} from '../src/mocks/handlers'

/**
 * ■ Metaオブジェクトの設定
 *
 * Metaオブジェクトは、このストーリーファイル全体に適用される設定を定義します。
 * ここで設定した内容は、すべての個別ストーリーに継承されます。
 */
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
    // デコレーターでコンポーネントを幅制限のあるコンテナで囲む
    // これにより、実際の使用環境に近い表示を確認できる
    decorators: [
        (Story) => (
            <div style={{maxWidth: '600px', margin: '0 auto'}}>
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ■ 各ストーリーの説明
 *
 * 以下、各ストーリーでどのハンドラーが使用され、
 * どのような動作をシミュレートしているかを説明します。
 */

/**
 * Default: 成功時のストーリー
 *
 * ■ 使用ハンドラー: defaultHandlers（handlers.tsからインポート）
 * ■ 返されるデータ: mockUsers（山田太郎、鈴木花子）
 * ■ HTTPステータス: 200 OK
 *
 * これは最も基本的なケースで、APIが正常に動作し、
 * ユーザーリストが取得できる場合をシミュレートします。
 */



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

/**
 * Loading: ローディング状態のストーリー
 *
 * ■ 使用ハンドラー: インラインで定義（特殊なケースのため）
 * ■ 動作: 無限に遅延させることでローディング状態を維持
 *
 * ■ なぜインラインで定義するのか？
 * このハンドラーは「永遠にレスポンスを返さない」という特殊な動作をします。
 * 実際のアプリケーションでは使用しないため、handlers.tsには含めず、
 * Storybook専用のハンドラーとしてインラインで定義しています。
 */
export const Loading: Story = {
    parameters: {
        docs: {
            description: {
                story: 'データ取得中のローディング状態を表示',
            },
        },
        msw: {
            handlers: [
                // 注: このケースは特殊なので、インラインで定義
                http.get('/api/users', async () => {
                    // delay('infinite')により、永遠にレスポンスを返さない
                    // これにより、コンポーネントのローディング状態を確認できる
                    await delay('infinite');
                    return HttpResponse.json(mockUsers);
                }),
            ],
        },
    },
};


/**
 * LoadingWithDelay: 遅延を含む実際的なローディング
 *
 * ■ 使用ハンドラー: specialHandlers.delayedResponse
 * ■ 返されるデータ: mswMockUsers（佐藤次郎、田中美咲、高橋健一）
 * ■ 遅延時間: 1秒
 *
 * 実際のAPIは即座にレスポンスを返さないことが多いため、
 * 1秒の遅延を含むハンドラーで実際の使用感を確認できます。
 */
export const LoadingWithDelay: Story = {
    parameters: {
        docs: {
            description: {
                story: '1秒の遅延後にデータを表示（実際のAPIの挙動を再現）',
            },
        },
        msw: {
            handlers: [specialHandlers.delayedResponse], // handlers.tsの遅延ハンドラーを使用
        },
    },
};

/**
 * Error: サーバーエラーのストーリー
 *
 * ■ 使用ハンドラー: errorHandlers.serverError
 * ■ HTTPステータス: 500 Internal Server Error
 * ■ 確認内容: エラーメッセージが適切に表示されるか
 *
 * APIサーバーで問題が発生した場合の挙動を確認します。
 * ユーザーに分かりやすいエラーメッセージが表示されることを確認してください。
 */
export const Error: Story = {
    parameters: {
        docs: {
            description: {
                story: 'APIエラー時のエラーメッセージ表示（500エラー）',
            },
        },
        msw: {
            handlers: [errorHandlers.serverError], // 500エラーを返すハンドラー
        },
    },
};

/**
 * NetworkError: ネットワークエラーのストーリー
 *
 * ■ 使用ハンドラー: errorHandlers.networkError
 * ■ 動作: ネットワークレベルのエラーをシミュレート
 * ■ 確認内容: オフライン時やネットワーク障害時の表示
 *
 * インターネット接続がない場合や、ネットワーク障害が発生した場合の
 * エラーハンドリングを確認します。
 */
export const NetworkError: Story = {
    parameters: {
        docs: {
            description: {
                story: 'ネットワークエラー時の表示',
            },
        },
        msw: {
            handlers: [errorHandlers.networkError], // ネットワークエラーをシミュレート
        },
    },
};

/**
 * EmptyList: 空のリストのストーリー
 *
 * ■ 使用ハンドラー: specialHandlers.emptyResponse
 * ■ 返されるデータ: []（空の配列）
 * ■ HTTPステータス: 200 OK
 *
 * ユーザーが登録されていない場合の表示を確認します。
 * 「データがありません」のようなメッセージが表示されるべきです。
 */
export const EmptyList: Story = {
    parameters: {
        docs: {
            description: {
                story: 'ユーザーが登録されていない場合の表示',
            },
        },
        msw: {
            handlers: [specialHandlers.emptyResponse], // 空の配列を返すハンドラー
        },
    },
};

/**
 * ManyUsers: 大量データのストーリー
 *
 * ■ 使用ハンドラー: インラインで定義
 * ■ 返されるデータ: 100人分のユーザーデータ
 * ■ 確認内容: パフォーマンスとスクロール動作
 *
 * ■ なぜインラインで定義するのか？
 * 100人分のデータは、パフォーマンステスト専用の特殊なケースです。
 * 実際のアプリケーションでは、ページネーションを使用するため、
 * このような大量データを一度に返すことはありません。
 */
export const ManyUsers: Story = {
    parameters: {
        docs: {
            description: {
                story: '100人のユーザーを表示する例（パフォーマンステスト用）',
            },
        },
        msw: {
            handlers: [
                http.get('/api/users', () => {
                    // プログラム的に100人分のデータを生成
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
};

/**
 * Responsive: レスポンシブ確認用のストーリー
 *
 * ■ 使用ハンドラー: defaultHandlers
 * ■ 特徴: ビューポート設定により、異なる画面サイズでの表示を確認
 *
 * モバイル、タブレット、デスクトップの各画面サイズで
 * コンポーネントが適切に表示されることを確認します。
 */
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
        // Storybookのビューポート設定
        // 画面上部のツールバーから画面サイズを切り替えられます
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
            defaultViewport: 'mobile', // デフォルトはモバイル表示
        },
    },
};

/**
 * DarkMode: ダークモードでの表示確認
 *
 * ■ 使用ハンドラー: defaultHandlers
 * ■ 特徴: ダークモード用のスタイルを適用
 *
 * ダークモードでもコンポーネントが読みやすく表示されることを確認します。
 * テキストのコントラストやカードの背景色などに注目してください。
 */
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
        // 背景色の設定
        backgrounds: {
            default: 'dark',
            values: [
                {name: 'light', value: '#ffffff'},
                {name: 'dark', value: '#1a1a1a'},
            ],
        },
    },
    // デコレーターでダークモードのクラスと背景を適用
    decorators: [
        (Story) => (
            <div
                className='dark'
                style={{
                    backgroundColor: '#1a1a1a',
                    padding: '20px',
                    minHeight: '400px',
                }}
            >
                <Story/>
            </div>
        ),
    ],
};

/**
 * ■ MSWのデバッグ方法
 *
 * 1. ブラウザの開発者ツールのコンソールを開く
 * 2. 以下のメッセージを確認：
 *    - "[MSW] Mocking enabled." → MSWが有効化されている
 *    - "[MSW] 200 GET /api/users" → リクエストがインターセプトされた
 *
 * 3. ネットワークタブで確認：
 *    - リクエストは実際には送信されない
 *    - Service Workerによってインターセプトされる
 *
 * ■ よくある問題と解決方法
 *
 * 1. "Failed to fetch users"エラー
 *    → msw-storybook-addonがインストールされていない
 *    → public/mockServiceWorker.jsが存在しない
 *
 * 2. データが表示されない
 *    → ハンドラーのパスが間違っている（/api/users vs /api/user）
 *    → ハンドラーが正しく登録されていない
 *
 * 3. 古いデータが表示される
 *    → ブラウザのキャッシュをクリア
 *    → Service Workerを更新（開発者ツール > Application > Service Workers）
 */

