# Connect App - フロントエンド

## プロジェクト概要

Connectアプリケーションのフロントエンドです。Next.js（React）とTypeScriptを使用したモダンなWebアプリケーションです。

## 🚀 主な技術スタック

- **フレームワーク**: Next.js 16.0.1 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.0
- **UIコンポーネント**: shadcn/ui (予定)
- **状態管理**: React Context API
- **フォーム管理**: React Hook Form + Zod (バリデーション)
- **API通信**: fetch API (SWR または TanStack Query を検討中)
- **テスト**: Jest + React Testing Library
- **Linting/Formatting**: ESLint + Prettier

## 🛠 環境要件

- Node.js 18.0 以上 (20.x 推奨)
- npm 9.x または yarn 1.22.x 以上
- Git 2.25 以上

## 🚀 クイックスタート

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/Fuku-x/connect-app.git
   cd connect-app/connect_frontend
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   # または
   yarn install
   ```

3. **環境変数の設定**
   `.env.local` ファイルを作成し、必要な環境変数を設定します。
   ```env
   # バックエンドAPIのベースURL
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   
   # 本番環境用
   # NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   # または
   yarn dev
   ```
   アプリケーションは [http://localhost:3000](http://localhost:3000) で利用可能です。

## 🛠 開発コマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを実行 |
| `npm start` | 本番サーバーを起動 |
| `npm test` | テストを実行 |
| `npm run lint` | コードのリントを実行 |
| `npm run lint:fix` | 自動修正可能なリントエラーを修正 |
| `npm run format` | コードをフォーマット |

## 🗂 プロジェクト構成

```
connect_frontend/
├── .next/                  # ビルド出力ディレクトリ（自動生成）
├── public/                 # 静的ファイル
│   ├── images/            # 画像アセット
│   ├── fonts/             # フォントファイル
│   ├── favicon.ico        # ファビコン
│   └── robots.txt         # 検索エンジン向け設定
│
├── src/
│   ├── app/               # アプリケーションルーティング（Next.js App Router）
│   │   ├── api/           # APIルートハンドラー
│   │   ├── (auth)/        # 認証関連ページ
│   │   ├── (dashboard)/   # ダッシュボード関連ページ
│   │   ├── layout.tsx     # ルートレイアウト
│   │   └── page.tsx       # ホームページ
│   │
│   ├── components/        # 再利用可能なUIコンポーネント
│   │   ├── ui/           # 基本的なUIコンポーネント（shadcn/ui）
│   │   ├── layout/       # レイアウトコンポーネント
│   │   └── features/     # 機能別コンポーネント
│   │
│   ├── lib/              # ユーティリティ関数と設定
│   │   ├── api/         # APIクライアント設定
│   │   └── utils/       # ユーティリティ関数
│   │
│   ├── styles/           # グローバルスタイル
│   ├── types/            # TypeScript型定義
│   └── tests/            # テストファイル
│
├── .eslintrc.json        # ESLint設定
├── .gitignore           # Git無視設定
├── next.config.js       # Next.js設定
├── package.json         # 依存関係とスクリプト
├── postcss.config.js    # PostCSS設定
├── tailwind.config.ts   # Tailwind CSS設定
└── tsconfig.json        # TypeScript設定
```

## 🧪 テスト

### テストの実行
```bash
# 全テストの実行
npm test

# ウォッチモードでテストを実行
npm test -- --watch

# カバレッジレポートの生成
npm test -- --coverage
```

## 🔄 Gitワークフロー

### ブランチ戦略
- `main`: 本番環境用ブランチ（保護ブランチ）
- `develop`: 開発用メインブランチ
- `feature/*`: 新機能開発用ブランチ
- `fix/*`: バグ修正用ブランチ
- `hotfix/*`: 緊急修正用ブランチ

### コミットメッセージ
コミットメッセージは以下のフォーマットに従ってください：

```
[タイプ](スコープ): 変更内容

[詳細説明（必要な場合）]
```

**タイプ一覧**:
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの更新
- `style`: コードのフォーマット、セミコロン追加など
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更
- `ci`: CI関連の変更
- `perf`: パフォーマンス改善
- `revert`: 変更の取り消し

## 🚀 デプロイ

### Vercelへのデプロイ
1. Vercelにログイン
2. リポジトリをインポート
3. 環境変数を設定
4. デプロイをトリガー

### 静的エクスポート
```bash
# 静的エクスポートを生成
npm run build

# 出力先: out/
```

## 📄 ライセンス

[MITライセンス](https://opensource.org/licenses/MIT)の下で公開されています。

## 👥 コントリビューション

1. イシューを作成して作業内容を報告
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'feat: 素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成
