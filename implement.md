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

#### ログアウトボタン実装

- **ファイル:** `components/sidebar/LeftSidebar.tsx`
- **変更箇所:** ファイル先頭に `'use client';` を追加、`handleLogout` 関数の追加、ボタン要素の追加 (仮配置)。
- **内容:**
  - `LeftSidebar`コンポーネントのログアウトボタンに`handleLogout`関数を追加
  - `handleLogout` 関数内で `supabase.auth.signOut` を呼び出し、ログアウト処理を実行。
  - ログアウト成功時にコンソールにメッセージを表示し、ログインページ (`/login`) へリダイレクト (`useRouter` 使用)。
  - ログアウト失敗時にはエラー内容をコンソールとアラートで表示。
  - トップページに仮のログアウトボタンを設置。
- ログイン状態でトップページを表示し、ログアウトボタンをクリックするとログインページへリダイレクトされることを確認した。

#### データ取得練習 (ログアウトボタンのカスタマイズ)

- **ファイル:** `components/sidebar/LeftSidebar.tsx`
- **変更箇所:** `useEffect` フックの追加、`useState` の追加、ログアウトボタンのテキスト部分の修正。
- **内容:**
  - `LeftSidebar` をクライアントコンポーネント (`'use client';`) にした。
  - `useState` でユーザー名 (`userName`) を管理。
  - `useEffect` 内で Supabase クライアント (`client.ts`) を使用。
  - `supabase.auth.getUser()` を使用して現在のログインユーザー情報を取得。（当初 `getSession()` で試したが `getUser()` で解決）
  - 取得したユーザー ID を使って `profile` テーブルから `name` を取得。
  - 取得した `name` を `useState` で状態にセット。
  - ログアウトボタンのテキストを、取得した `userName` を使って動的に表示するように変更 (例: `{userName} からログアウト`)。
- ログイン後、サイドバーのログアウトボタンに登録した名前が表示されることを確認した。

## 2. ユーザープロフィール

### Supabase テーブル作成 (`profile`)

- Supabase ダッシュボードの Table Editor を使用して `profile` テーブルを新規作成した。
- RLS は無効 (チェックを外した)。
- カラム構成:
  - `id` (Type: `uuid`, Primary Key, Foreign Key to `auth.users.id`)
    - ※ Default Value は `auth.uid()`
  - `name` (Type: `text`, Not Nullable)
  - `introduction` (Type: `text`, Nullable)
  - `icon` (Type: `text`, Nullable)
- 設定を保存し、テーブルを作成した。

#### ユーザー登録時の自動プロフィール作成 (DBトリガー)

- **目的:** 新規ユーザー登録時に `auth.users` テーブルと `profile` テーブルを自動で関連付ける。
- **方法:** Supabase SQL Editor を使用してデータベース関数とトリガーを作成。
- **関数作成 (`handle_new_user`):** `auth.users` にユーザーが追加された際に実行され、`profile` テーブルに `id` (ユーザーID) と `name` (登録時に入力された名前) を挿入する PL/pgSQL 関数を作成した。
- **トリガー作成 (`on_auth_user_created`):** `auth.users` テーブルへの `INSERT` 操作後に `handle_new_user` 関数を実行するトリガーを作成した。

  ```sql
  -- ユーザー登録時に自動で public.profile テーブルにデータを挿入する関数の定義

  -- 関数の作成
  -- 新しいユーザーが作成された際に自動的に実行される
  create function public.handle_new_user()
  returns trigger                               -- トリガーから呼び出される関数のため trigger を返す
  language plpgsql                              -- PL/pgSQL（PostgreSQL拡張SQL）で記述
  security definer                              -- 実行者ではなく関数定義者（Supabaseの管理者ロール）として実行される
  set search_path = public                      -- 関数内で使用するスキーマは public に限定する
  as $$
  begin
    -- 新規ユーザー（auth.users テーブルの行）が作成された際に、
    -- 対応する profile レコードを作成する
    insert into public.profile (id, name)
    values (
      new.id,                                    -- auth.users テーブルの UUID。profile.id として使用（外部キーとして一致）
      new.raw_user_meta_data->>'name'            -- ユーザー登録時に指定されたカスタムメタデータから "name" を取得して profile.name に設定
    );

    -- トリガー関数では通常 return new で新しい行を返す（ルール）
    return new;
  end;
  $$;

  -- トリガーの作成：auth.users テーブルに新しいユーザーが追加された直後に handle_new_user 関数を呼び出す

  create trigger on_auth_user_created
    after insert on auth.users                  -- ユーザーが作成された直後に発火（AFTER INSERT）
    for each row                                -- 各行に対して1回ずつ実行
    execute procedure public.handle_new_user(); -- 上で定義した関数を実行

  ```

- **確認方法:** `/register` ページから新規ユーザーを登録し、Supabase ダッシュボードの Table Editor で `profile` テーブルに、登録したユーザーの ID と名前を持つ新しい行が自動的に追加されていることを確認する。

#### UI 作成 (ユーザープロフィール画面)

- `app/[userId]/page.tsx`にプロフィール表示画面の基本的な UI を作成した。
- サーバーコンポーネントとして実装し、ダミーデータを表示。

#### プロフィール情報取得・表示

- **ファイル:** `app/[userId]/page.tsx`
- **変更箇所:** `async` 化、`createClient` (サーバー用) のインポート・使用、データ取得ロジック、表示部分の更新。
- **内容:**
  - ページコンポーネントを `async` 関数に変更。
  - `utils/supabase/server.ts` の `createClient` を `await` 付きで呼び出し。
  - URL パラメータの `userId` を使用して `profile` テーブルから `name`, `introduction`, `icon` を `.select().eq().single()` で取得。
  - プロフィールが見つからない場合は `notFound()` を呼び出して 404 ページを表示。
  - 取得したデータを JSX に反映させ、名前、自己紹介、アイコン (デフォルトパス含む) を表示。
- **確認方法:** `/(登録済みユーザーID)` にアクセスし、Supabase の `profile` テーブルに登録されている情報が表示されること、および存在しない ID でアクセスすると 404 ページが表示されることを確認する。
