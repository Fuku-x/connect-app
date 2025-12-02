# Kobe Connect

神戸電子専門学校向けの学生間コラボレーションプラットフォーム

## プロジェクト概要

Kobe Connectは、神戸電子専門学校の学生がプロジェクトメンバーを募集・参加するためのプラットフォームです。学生同士がスキルを活かし合い、新しいプロジェクトを始めるきっかけを提供します。

## 主な機能

### ユーザー認証
- メールアドレスとパスワードによる登録・ログイン
- プロフィール管理
- ポートフォリオの作成・公開

### メンバー募集
- プロジェクトのメンバー募集の投稿
- スキルタグによる検索
- 応募機能

### メッセージング
- ユーザー間のメッセージのやり取り
- 未読メッセージ通知

### タスク管理
- プロジェクトタスクの作成・管理
- 進捗状況のトラッキング

## 技術スタック

### フロントエンド
- Next.js
- TypeScript
- Ant Design
- Tailwind CSS
- React Query

### バックエンド
- Laravel
- MySQL
- JWT認証

## セットアップ手順

### フロントエンド
```bash
cd connect_frontend
npm install
cp .env.example .env.local
# .env.localを編集
npm run dev
```

### バックエンド
```bash
cd connect_backend
composer install
cp .env.example .env
# .envを編集
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## 環境変数

### フロントエンド
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### バックエンド
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kobe_connect
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_jwt_secret
```

## ディレクトリ構成図
```bash
connect-app/
├── connect_frontend/    # フロントエンド
│   ├── src/
│   │   ├── app/         # ページコンポーネント
│   │   ├── components/  # 共通コンポーネント
│   │   └── lib/         # ユーティリティ
│   └── public/          # 静的ファイル
│
└── connect_backend/     # バックエンド
    ├── app/             # アプリケーションロジック
    ├── config/          # 設定ファイル
    ├── database/        # マイグレーション・シーダー
    └── routes/          # APIルート
```
