# Connect App - バックエンド

## プロジェクト概要
このリポジトリはConnectアプリケーションのバックエンドAPIサーバーです。Laravelフレームワークを使用して構築されています。

## 環境要件

- PHP 8.1以上
- Composer 2.0以上
- MySQL 5.7以上 / PostgreSQL 10.0以上 / SQLite 3.8.8以上 / SQL Server 2017以上
- Node.js 16.0以上 (フロントエンドアセットのビルドに必要)

## セットアップ手順

1. リポジトリをクローン
   ```bash
   git clone https://github.com/Fuku-x/connect-app.git
   cd connect-app/connect_backend
   ```

2. 依存関係のインストール
   ```bash
   composer install
   ```

3. 環境設定ファイルの作成
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. データベースの設定
   `.env`ファイルを編集してデータベース接続情報を設定
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=connect_app
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. データベースマイグレーションの実行
   ```bash
   php artisan migrate
   ```

6. 開発サーバーの起動
   ```bash
   php artisan serve
   ```

## 開発

### テストの実行
```bash
php artisan test
```

### コードスタイルチェック
```bash
composer check-style
```

### コードスタイルの自動修正
```bash
composer fix-style
```

## APIドキュメント

APIドキュメントは以下のコマンドで生成できます:
```bash
php artisan l5-swagger:generate
```

## デプロイ

### 本番環境用の最適化
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## ディレクトリ構成

```
app/                    # アプリケーションのコアロジック
├── Console/           # Artisanコマンド
├── Exceptions/        # 例外ハンドラ
├── Http/              # コントローラ、ミドルウェア、フォームリクエスト
└── Models/            # データモデル

config/                # 設定ファイル

database/              # データベース関連
├── factories/         # テストデータファクトリ
├── migrations/        # データベースマイグレーション
└── seeders/           # シーダークラス

routes/                # ルート定義
├── api.php           # APIルート
├── console.php        # コンソールコマンドのルート
└── web.php            # Webルート

tests/                 # テストケース
```

## コントリビューション

1. 機能ブランチを作成してください (`git checkout -b feature/AmazingFeature`)
2. 変更をコミットしてください (`git commit -m 'Add some AmazingFeature'`)
3. ブランチにプッシュしてください (`git push origin feature/AmazingFeature`)
4. プルリクエストを開いてください

## ライセンス

[MITライセンス](https://opensource.org/licenses/MIT)の下で公開されています。
