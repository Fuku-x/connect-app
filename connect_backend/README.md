# Kobe Connect - バックエンド

神戸電子専門学校の学生のためのコミュニケーション・コラボレーションプラットフォームのAPIサーバー

## 技術スタック

- **フレームワーク**: Laravel 12.x
- **言語**: PHP 8.2+
- **データベース**: MySQL / SQLite
- **認証**: JWT (tymon/jwt-auth)

## セットアップ

### 必要条件

- PHP 8.2 以上
- Composer
- MySQL または SQLite

### インストール手順

1. **依存関係のインストール**
   ```bash
   cd connect_backend
   composer install
   ```

2. **環境設定ファイルの作成**
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   ```

3. **データベースの設定**
   
   `.env` ファイルを編集:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=connect_app
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
   
   または SQLite を使用:
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=/absolute/path/to/database.sqlite
   ```

4. **データベースマイグレーション**
   ```bash
   php artisan migrate
   ```

5. **開発サーバーの起動**
   ```bash
   php artisan serve
   ```
   
   APIは http://localhost:8000 で利用可能

## API エンドポイント

### 認証
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/api/register` | ユーザー登録 |
| POST | `/api/login` | ログイン |
| POST | `/api/logout` | ログアウト |
| GET | `/api/me` | 現在のユーザー情報 |

### プロフィール
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/profile` | プロフィール取得 |
| PUT | `/api/profile` | プロフィール更新 |

### ポートフォリオ
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/portfolio` | 自分のポートフォリオ一覧 |
| POST | `/api/portfolio` | ポートフォリオ作成 |
| GET | `/api/portfolio/{id}` | ポートフォリオ詳細 |
| PUT | `/api/portfolio/{id}` | ポートフォリオ更新 |
| DELETE | `/api/portfolio/{id}` | ポートフォリオ削除 |
| GET | `/api/public/portfolios` | 公開ポートフォリオ一覧 |

### メンバー募集
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/recruitments` | 募集一覧 |
| POST | `/api/recruitments` | 募集作成 |
| GET | `/api/recruitments/{id}` | 募集詳細 |
| PUT | `/api/recruitments/{id}` | 募集更新 |
| DELETE | `/api/recruitments/{id}` | 募集削除 |

### タスク
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/tasks` | タスク一覧 |
| POST | `/api/tasks` | タスク作成 |
| PUT | `/api/tasks/{id}` | タスク更新 |
| PATCH | `/api/tasks/{id}/status` | ステータス更新 |
| DELETE | `/api/tasks/{id}` | タスク削除 |

### メッセージ
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/messages/conversations` | 会話一覧 |
| GET | `/api/messages/conversations/{id}` | メッセージ取得 |
| POST | `/api/messages/send` | メッセージ送信 |
| POST | `/api/messages/start` | 会話開始 |
| GET | `/api/messages/unread-count` | 未読数取得 |

## ディレクトリ構成

```
app/
├── Http/
│   └── Controllers/
│       └── Api/           # APIコントローラー
│           ├── AuthController.php
│           ├── PortfolioController.php
│           ├── RecruitmentController.php
│           ├── TaskController.php
│           └── MessageController.php
└── Models/                # Eloquentモデル
    ├── User.php
    ├── Portfolio.php
    ├── Recruitment.php
    ├── Task.php
    ├── Conversation.php
    └── Message.php

database/
└── migrations/            # マイグレーションファイル

routes/
└── api.php               # APIルート定義
```

## テスト

```bash
php artisan test
```

## ライセンス

MIT License
