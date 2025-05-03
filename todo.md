# X-Clone 開発タスクリスト (レベル別)

このタスクリストは、プログラミング初心者の方が X (Twitter) クローンアプリ開発を段階的に進められるようにレベル分けされています。

## ☆1: 基本的な表示と最低限の機能 (まずは動かす！)

**目標:** アプリの骨格を作り、主要な情報を表示・登録できるようにする。バックエンドは Supabase を使い、GUI 操作や簡単な API を中心に進める。バリデーションや細かい制御は後回し。

**環境:** Next.js (App Router, TypeScript, Tailwind CSS), Supabase (BaaS: Auth, DB), GitHub

### 0. 準備

- [ ] **Git/GitHub:**
  - [ ] GitHub で新規リポジトリを作成 (例: `x-clone`)
  - [ ] ローカルにリポジトリをクローン (`git clone <リポジトリURL>`)
  - [ ] プロジェクトディレクトリに移動 (`cd x-clone`)
- [ ] **Next.js プロジェクト (クローン後):**
  - [ ] 依存関係のインストール (`npm install`)
  - [ ] 開発サーバー起動確認 (`npm run dev` で http://localhost:3000 が表示される)
- [ ] **Supabase プロジェクト:**
  - [ ] Supabase 公式サイトで新規プロジェクトを作成
  - [ ] プロジェクト URL と `anon` key を控えておく (後で環境変数に設定)
- [ ] **Supabase Client (JavaScript) 導入:**
  - [ ] ライブラリインストール: `npm install @supabase/supabase-js`
- [ ] **環境変数設定:**
  - [ ] プロジェクトルートに `.env.local` ファイルを作成
  - [ ] 以下の内容を記述 (Supabase の設定値に置き換える):
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
- [ ] **初期コミット:**
  - [ ] `git add .`
  - [ ] `git commit -m "feat: initial project setup with Next.js, TypeScript, Tailwind, Supabase"`
  - [ ] `git push origin main` (またはデフォルトブランチ名)

### 1. 認証 (Supabase Auth)

- [ ] **Supabase:** GUI で Authentication を有効化 (Email/Password)
- [ ] **FE:** サインアップ画面 (`/signup`) の UI 作成 (メール, パスワード, 名前入力)
- [ ] **FE:** Supabase Auth を使ったサインアップ処理の実装
- [ ] **FE:** ログイン画面 (`/login`) の UI 作成 (メール, パスワード入力)
- [ ] **FE:** Supabase Auth を使ったログイン処理の実装
- [ ] **FE:** ログアウトボタンの実装 (Supabase Auth 連携)
- [ ] **FE:** ログイン状態の取得と表示への反映 (例: ヘッダー表示切替)
- [ ] **FE:** 認証が必要なページへの簡易的なアクセス制御 (ログインしていなければリダイレクト)

### 2. ユーザープロフィール

- [ ] **Supabase:** GUI で `profiles` テーブル作成 (id (auth.users.id への FK), name, bio, profile_image_url など)
  - ※ `users` テーブルは Supabase Auth が自動作成
- [ ] **FE:** ユーザープロフィール表示画面 (`/profile/[userId]`) の UI 作成 (名前、自己紹介などを表示)
- [ ] **FE:** Supabase DB からプロフィール情報を取得して表示
  - ※ RLS はまだ設定しない (全公開)
- [ ] **FE:** プロフィール編集画面 (`/settings/profile`) の UI 作成 (フォームのみ)
  - ※ 更新処理は ☆3 で実装

### 3. 投稿 (ポスト)

- [ ] **Supabase:** GUI で `posts` テーブル作成 (id, user_id (profiles.id), content, created_at)
- [ ] **FE:** 投稿フォーム UI 作成 (ホーム画面上部など、テキスト入力とボタン)
- [ ] **FE:** Supabase DB へ投稿データを保存する処理の実装 (ログインユーザー ID を含む)
- [ ] **FE:** 投稿リスト表示 UI コンポーネント作成 (ユーザー名、内容、日時)
- [ ] **FE:** Supabase DB から全投稿を取得してタイムラインに表示 (新しい順)
  - ※ RLS はまだ設定しない

### 4. 基本的なインタラクション (UI のみ)

- [ ] **FE:** 投稿に「いいね」ボタンの UI を追加 (機能は ☆2)
- [ ] **FE:** プロフィール画面に「フォロー」ボタンの UI を追加 (機能は ☆2)

---

## ☆2: 主要機能の実装 (アプリらしく！)

**目標:** ☆1 で作成した骨格に、フォロー、いいね、返信などの主要なインタラクション機能を追加する。バックエンド API を Next.js API Routes または簡単なサーバー (Node.js/Express など) で作成し始める。

**環境:** ☆1 + Next.js API Routes (BE), Supabase (DB)

### 1. フォロー機能

- [ ] **Supabase:** GUI で `follows` テーブル作成 (id, follower_id (profiles.id), following_id (profiles.id), created_at)
- [ ] **BE:** フォロー実行 API (`/api/users/[userId]/follow`) 作成 (DB に保存)
- [ ] **BE:** フォロー解除 API (`/api/users/[userId]/unfollow`) 作成 (DB から削除)
- [ ] **BE:** フォロー状態確認 API (`/api/users/[userId]/follow_status`) 作成
- [ ] **FE:** フォロー/アンフォローボタン UI と API 連携 (プロフィール画面など)

### 2. ホームタイムライン

- [ ] **BE:** ホームタイムライン取得 API (`/api/timeline/home`) 作成
  - ログインユーザーがフォローしているユーザーの投稿と自分の投稿を取得
  - 新しい順にソート
- [ ] **FE:** ホーム画面 (`/`) で上記 API と連携して投稿を表示

### 3. ユーザープロフィールタイムライン

- [ ] **BE:** 特定ユーザーの投稿一覧取得 API (`/api/users/[userId]/posts`) 作成
- [ ] **FE:** ユーザープロフィール画面で上記 API と連携して投稿を表示

### 4. いいね機能

- [ ] **Supabase:** GUI で `likes` テーブル作成 (id, user_id (profiles.id), post_id (posts.id), created_at)
- [ ] **BE:** いいね実行 API (`/api/posts/[postId]/like`) 作成 (DB に保存)
- [ ] **BE:** いいね解除 API (`/api/posts/[postId]/unlike`) 作成 (DB から削除)
- [ ] **BE:** 投稿取得 API にいいね数とログインユーザーのいいね状態を含めるよう修正
- [ ] **FE:** いいねボタン UI と API 連携 (いいね状態の反映、いいね数の表示)

### 5. 返信 (コメント) 機能

- [ ] **Supabase:** GUI で `comments` テーブルを新規作成 (id, user_id (profiles.id), post_id (posts.id), content, created_at)
- [ ] **BE:** 返信作成 API (`/api/posts/[postId]/reply`) 作成 (DB に保存)
- [ ] **FE:** 返信入力フォーム UI (投稿の下など) と API 連携
- [ ] **BE:** 特定投稿への返信一覧取得 API (`/api/posts/[postId]/replies`) 作成
- [ ] **FE:** 投稿詳細画面などで返信一覧を表示 (任意)

### 6. リツイート機能 (シンプルなリポスト)

- [ ] **Supabase:** GUI で `retweets` テーブル作成 (id, user_id (profiles.id), post_id (posts.id), created_at)
- [ ] **BE:** リツイート実行 API (`/api/posts/[postId]/retweet`) 作成
- [ ] **BE:** リツイート解除 API (`/api/posts/[postId]/unretweet`) 作成
- [ ] **BE:** ホームタイムライン API でリツイートも取得するように修正
- [ ] **FE:** リツイートボタン UI と API 連携、リツイート数の表示
- [ ] **FE:** タイムラインでのリツイート表示 (「〇〇さんがリツイート」)

### 7. 引用リポスト機能

- [ ] **Supabase:** GUI で `posts` テーブルに `quoted_post_id` (posts.id への FK, nullable) カラム追加
- [ ] **BE:** 引用リポスト作成 API (`/api/posts/quote`) 作成
- [ ] **FE:** 引用リポスト作成用モーダル UI と API 連携
- [ ] **FE:** タイムラインでの引用リポスト表示

### 8. ハッシュタグ機能

- [ ] **Supabase:** GUI で `hashtags` (id, name), `post_hashtags` (post_id, hashtag_id) テーブル作成
- [ ] **BE:** 投稿作成/編集時にハッシュタグを抽出し DB に保存/関連付けする処理
- [ ] **FE:** 投稿本文中のハッシュタグをリンク化 (`/explore/tags/[tagName]`)
- [ ] **BE:** 特定ハッシュタグの投稿一覧取得 API (`/api/tags/[tagName]/posts`) 作成
- [ ] **FE:** ハッシュタグ別投稿一覧画面 (`/explore/tags/[tagName]`) の作成と API 連携

### 9. 検索機能 (投稿内容)

- [ ] **BE:** 投稿内容検索 API (`/api/search/posts?q=keyword`) 作成 (簡単な部分一致検索)
- [ ] **FE:** 検索バー UI コンポーネント作成
- [ ] **FE:** 検索結果表示画面 (`/search`) の作成と API 連携

### 10. 無限スクロール

- [ ] **FE:** 各タイムライン (ホーム, ユーザー, ハッシュタグ, 検索結果) で無限スクロールを実装 (ページネーション API 連携)

---

## ☆3: 技術的洗練と発展的な機能 (本格的な開発へ！)

**目標:** Prisma の導入、バックエンドの強化 (バリデーション、エラー処理、アクセス制御)、画像アップロード、パフォーマンス改善、テスト、デプロイなど、より実践的な技術を取り入れ、アプリの完成度を高める。

**環境:** ☆2 + Prisma (ORM), Next.js API Routes (BE), Supabase Storage (ファイルストレージ)

### 1. Prisma 導入とマイグレーション

- [ ] Prisma の導入とセットアップ
- [ ] `schema.prisma` ファイルの作成 (既存の Supabase スキーマを反映)
- [ ] Prisma Migrate を使ったマイグレーション管理の開始
- [ ] **BE:** 既存の Supabase DB アクセスコードを Prisma Client を使うように書き換え

### 2. バックエンド強化 (NestJS or API Routes)

- [ ] (推奨) NestJS プロジェクトのセットアップ、または Next.js API Routes の構造化
- [ ] **BE:** DTO (Data Transfer Object) の導入と Class Validator などによる入力バリデーション実装
- [ ] **BE:** 認証ミドルウェア/ガードの実装 (JWT 検証など、Supabase Auth と連携)
- [ ] **BE:** 包括的なエラーハンドリング機構の導入 (カスタム例外、エラーフィルター)
- [ ] **BE:** 権限チェックの実装 (例: 投稿の編集・削除は本人のみ) - RLS と組み合わせるか BE で実装

### 3. プロフィール編集機能 (本格実装)

- [ ] **BE:** プロフィール更新 API (`/api/profile`) の本格実装 (Prisma, バリデーション, 認証)
- [ ] **FE:** プロフィール編集画面のフォームと更新 API の連携
- [ ] **BE:** プロフィール画像/ヘッダー画像アップロード API (`/api/profile/image`) の作成
  - ファイル受け取り、バリデーション
  - Cloudinary や S3 等のファイルストレージへのアップロード処理
  - アップロードした URL を Prisma で DB に保存
- [ ] **FE:** 画像アップロード UI (ファイル選択、プレビュー) と API 連携

### 4. 投稿機能 (本格実装)

- [ ] **BE:** 投稿作成 API (`/api/posts`) の強化 (Prisma, バリデーション, ハッシュタグ処理)
- [ ] **BE:** 投稿編集 API (`/api/posts/:postId`) の実装 (Prisma, バリデーション, 権限チェック)
- [ ] **FE:** 投稿編集モーダル/画面 UI と API 連携
- [ ] **BE:** 投稿削除 API (`/api/posts/:postId`) の実装 (Prisma, 権限チェック)
- [ ] **FE:** 投稿削除ボタンと API 連携
- [ ] **BE:** 画像/動画付き投稿の API 実装 (ファイルストレージ連携)
- [ ] **FE:** 投稿フォームでの画像/動画アップロード機能の本格実装

### 5. アクセス制御 (RLS)

- [ ] **Supabase:** RLS ポリシーの設定 (例: 自分のプロフィールは自分で更新可能、投稿は誰でも読めるが削除は本人のみ、フォロー関係はログインユーザーのみ操作可能など)
- [ ] BE/FE で RLS を考慮したデータアクセスを確認・修正

### 6. パフォーマンスと UX 改善

- [ ] **DB:** Prisma スキーマやクエリを見直し、必要に応じてインデックスを追加
- [ ] **BE:** API のレスポンス時間計測とボトルネック特定、クエリ最適化
- [ ] **FE:** ローディング状態の表示 (スピナー、スケルトンローダー) の改善
- [ ] **FE:** コード分割 (Dynamic Imports) による初期ロード時間の短縮
- [ ] **FE:** 画像の遅延読み込み (Lazy Loading)
- [ ] **FE:** レスポンシブデザイン対応 (各種画面サイズでの表示確認と調整)

### 7. 発展的な機能 (任意)

- [ ] **BE/FE:** 通知機能 (いいね、リツイート、フォロー、返信があった場合に通知)
  - DB 設計 (notifications テーブル)
  - 通知生成ロジック (BE)
  - 通知取得 API (BE)
  - 通知表示 UI (FE)
  - (リアルタイム通知は WebSocket などが必要でさらに発展的)
- [ ] **BE/FE:** OAuth 認証 (Google, Twitter など) の追加 (Supabase Auth の機能を利用)

### 8. テスト

- [ ] **BE:** ユニットテスト (Jest など) の作成 (主要なサービス、ロジック)
- [ ] **BE:** E2E テスト (Supertest など) の作成 (主要な API エンドポイント)
- [ ] **FE:** コンポーネントテスト (React Testing Library, Jest) の作成 (主要な UI コンポーネント)
- [ ] **FE:** E2E テスト (Cypress, Playwright) の作成 (主要なユーザーフロー)

### 9. デプロイ

- [ ] **BE/FE:** デプロイ環境の準備 (Vercel, Render, Fly.io, AWS など)
- [ ] 環境変数の設定 (Supabase URL/Key, DB URL (Prisma), ファイルストレージキーなど)
- [ ] デプロイパイプラインの設定 (GitHub Actions などで自動化)
- [ ] アプリケーションのデプロイと動作確認
