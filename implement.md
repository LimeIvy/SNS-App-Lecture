# X-Clone 実装記録

このドキュメントは、`todo.md` に基づいて X-Clone アプリを実装した際の記録です。

## ☆1: 基本的な表示と最低限の機能

### 0. 準備

#### Git/GitHub 設定

- GitHub 上でリポジトリ (`x-clone`) を作成した。
- ローカル環境にリポジトリをクローンし、プロジェクトディレクトリに移動した。
  ```bash
  git clone <リポジトリURL>
  cd x-clone
  ```

#### Next.js プロジェクト (クローン後)

- プロジェクトルートで `npm install` を実行し、依存関係をインストールした。
- `npm run dev` で開発サーバーを起動し、`http://localhost:3000` で初期画面が表示されることを確認した。

#### Supabase プロジェクト作成と接続設定

- Supabase 公式サイトで新規プロジェクトを作成した。
- プロジェクトダッシュボードの「Connect」ボタンから Next.js (App Router) 用の設定を取得した。
- Next.js プロジェクトルートに `.env.local` ファイルを作成し、取得した Supabase の URL と anon キーを記述した。
  ```.env.local
  NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
  ```
- ターミナルで `npm install @supabase/supabase-js @supabase/ssr` を実行し、Supabase Client ライブラリをインストールした。

#### 初期コミット

- `.gitignore` に `.env.local` が含まれていることを確認した。
- `git add .` で変更をステージングした。
- `git commit -m "feat: initial project setup with Next.js, TypeScript, Tailwind, Supabase"` でコミットした。
- `git push origin main` でリモートリポジトリにプッシュした。

### 1. 認証 (Supabase Auth)

#### Supabase 設定

- Supabase ダッシュボード > Authentication > Providers で Email プロバイダーが有効になっていることを確認した。
- 開発を容易にするため、Email プロバイダーの設定で "Confirm email" を無効にした。

#### Supabase クライアントユーティリティ作成

- クライアントコンポーネント用のユーティリティ (`utils/supabase/client.ts`) を作成した。 (`createBrowserClient` を使用)
- サーバーコンポーネント/アクション/API Routes 用のユーティリティ (`utils/supabase/server.ts`) を作成した。 (`createServerClient` と Cookie ハンドラ (`getAll`/`setAll` 等) を使用)

#### Middleware 実装

- プロジェクトルートに `middleware.ts` を作成した。
- Middleware 内でセッションを更新し、認証状態を確認するためのユーティリティ関数 (`utils/supabase/middleware.ts` の `updateSession`) を作成・実装した。
- 開発サーバーを再起動し、トップページ `/` などにアクセスした際に `/login` へリダイレクトされることを確認した（`/login` が未作成のため 404 表示となるが、リダイレクト動作自体は成功）。

#### UI 作成 (ユーザー登録画面)

- `app/register/page.tsx` にユーザー登録フォームの基本的な UI を作成した。
- 現時点ではフォーム送信時の登録処理は実装せず、コンソールにログを出力するのみ。

#### UI 作成 (ログイン画面)

- `app/login/page.tsx` にログインフォームの基本的な UI を作成した。
- 現時点ではフォーム送信時のログイン処理は実装せず、コンソールにログを出力するのみ。
- `/register` および `/login` ページで「登録する」「ログイン」ボタンをクリックすると、ブラウザの開発者ツールコンソールに入力内容がログとして表示されることを確認した。

#### ユーザー登録処理実装

- `app/register/page.tsx` の `handleSubmit` 関数を修正した。
- `utils/supabase/client.ts` から Supabase クライアントをインポートして使用した。
- `supabase.auth.signUp` メソッドを呼び出して、入力されたメールアドレス、パスワード、名前でユーザー登録を行うようにした。
- 登録成功時にはアラートを表示し、ホームページ (`/`) へリダイレクトするようにした (`useRouter` 使用)。
- 登録失敗時にはエラー内容をコンソールとアラートで表示するようにした。
- 実際にユーザー登録を行い、Supabase の Users テーブルにデータが作成されること、および成功時にリダイレクトされることを確認した。

#### ログイン処理実装

- **ファイル:** `app/login/page.tsx`
- **変更箇所:** `handleSubmit` 関数、必要なモジュール (`createClient`, `useRouter`) のインポート。
- **内容:**
  - `handleSubmit` を `async` 関数に変更。
  - `utils/supabase/client.ts` から Supabase クライアントを取得。
  - `supabase.auth.signInWithPassword` メソッドを呼び出し、入力されたメールとパスワードでログイン処理を実行。
  - ログイン成功時にはアラート表示とホームページ (`/`) へのリダイレクト (`useRouter` 使用)。
  - ログイン失敗時にはエラー内容をコンソールとアラートで表示。
- 登録済みのユーザー情報でログインし、成功時にトップページが表示される（リダイレクトされる）ことを確認した。
