# Kobe Connect - フロントエンド

神戸電子専門学校の学生のためのコミュニケーション・コラボレーションプラットフォーム

## 機能一覧

- **ユーザー認証**: 神戸電子メールアドレスでの登録・ログイン
- **ダッシュボード**: プロジェクト・募集・メッセージの一元管理
- **ポートフォリオ管理**: スキルやプロジェクトを公開・共有
- **メンバー募集**: プロジェクトメンバーの募集・検索
- **タスク管理**: プロジェクトのタスクを管理
- **ダイレクトメッセージ**: ユーザー間のチャット機能
- **プロフィール編集**: 氏名・学科・学年・自己紹介の設定

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Ant Design v5
- **API通信**: Axios

## セットアップ

### 必要条件

- Node.js 18.0 以上
- npm または yarn
- バックエンドサーバーが起動していること

### インストール手順

1. **依存関係のインストール**
   ```bash
   cd connect_frontend
   npm install
   ```

2. **環境変数の設定**
   
   `.env.local` ファイルを作成:
   ```env
   API_BASE_URL=http://localhost:8000
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   ブラウザで http://localhost:3000 を開く

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルド後の起動
npm start
```

## ディレクトリ構成

```
src/
├── app/                    # ページ（App Router）
│   ├── auth/              # 認証ページ（ログイン・登録）
│   ├── dashboard/         # ダッシュボード
│   │   ├── portfolios/   # ポートフォリオ管理
│   │   └── profile/      # プロフィール編集
│   ├── messages/          # メッセージ機能
│   ├── portfolio/         # ポートフォリオ詳細・編集
│   ├── portfolios/        # 公開ポートフォリオ一覧
│   ├── recruitments/      # メンバー募集
│   └── tasks/            # タスク管理
├── components/            # 再利用可能なコンポーネント
├── lib/                   # ユーティリティ・API設定
└── types/                 # TypeScript型定義
```

## 主要なページ

| パス | 説明 |
|------|------|
| `/` | ウェルカムページ |
| `/auth/login` | ログイン |
| `/auth/register` | 新規登録 |
| `/dashboard` | ダッシュボード |
| `/dashboard/profile` | プロフィール編集 |
| `/portfolios` | 公開ポートフォリオ一覧 |
| `/recruitments` | メンバー募集一覧 |
| `/tasks` | タスク管理 |
| `/messages` | メッセージ一覧 |

## ライセンス

MIT License
