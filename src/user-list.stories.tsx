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
 */

import {Meta, StoryObj} from "@storybook/nextjs-vite";
import {delay, http, HttpResponse} from 'msw';
import {UserList} from "@/components/user-list";
import { handlers as defaultHandlers, errorHandlers, specialHandlers, mockUsers, mswMockUsers } from '../src/mocks/handlers'

/**
 * 既存のMSWハンドラーをインポート
 *
 * ■ handlers.tsの構成：
 * - handlers: デフォルトのAPIハンドラー（基本的な成功レスポンス）
 * - errorHandlers: エラーレスポンスのハンドラー（500エラー、ネットワークエラーなど）
 * - specialHandlers: 特殊なケース用のハンドラー（空のレスポンス、遅延レスポンスなど）
 * - mockUsers: デフォルトのモックユーザーデータ（山田太郎、鈴木花子）
 * - mswMockUsers: 別のモックユーザーデータ（佐藤次郎、田中美咲、高橋健一）
 */


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


