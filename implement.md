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
  - `handleLogout` 関数内で `utils/supabase/client.ts` から取得した `supabase.auth.signOut` を呼び出し、ログアウト処理を実行。
  - ログアウト成功時にコンソールにメッセージを表示し、ログインページ (`/login`) へリダイレクト (`useRouter` 使用)。
  - ログアウト失敗時にはエラー内容をコンソールとアラートで表示。
  - トップページに仮のログアウトボタンを設置。
- ログイン状態でトップページを表示し、ログアウトボタンをクリックするとログインページへリダイレクトされることを確認した。

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

#### データ取得練習 (ログアウトボタンのカスタマイズ)

- **ファイル:** `components/sidebar/LeftSidebar.tsx`
- **変更箇所:** `useEffect` フックの追加、`useState` の追加、ログアウトボタンのテキスト部分の修正。
- **内容:**
  - `LeftSidebar` をクライアントコンポーネント (`'use client'`) にした。
  - `useState` でユーザー名 (`userName`) 、ユーザーID (`userId`)、アイコンパス (`userIcon`) を管理。
  - `useEffect` 内で Supabase クライアント (`utils/supabase/client.ts`) を使用。
  - `supabase.auth.getUser()` を使用して現在のログインユーザー情報を取得。
  - 取得したユーザー ID を `userId` ステートにセット。
  - 取得した `user_metadata` から名前とアイコンパスを取得し、`userName` と `userIcon` ステートにセット。
  - ログアウトボタンのテキストとアイコン表示、プロフィールリンクのパスを、`useState` で管理している状態を使って動的に表示するように変更。
- ログイン後、サイドバーのログアウトボタンに登録した名前が表示され、アイコンが表示されること、プロフィールリンクが正しく設定されることを確認した。

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

## 3. 投稿機能とタイムライン表示 (☆1)

### Supabase テーブル作成 (`posts`)

- Supabase ダッシュボードの Table Editor を使用して `posts` テーブルを新規作成した。
- RLS は無効 (チェックを外した)。
- カラム構成:
  - `id` (Type: `uuid`, Primary Key, Default: `gen_random_uuid()`)
  - `user_id` (Type: `uuid`, Foreign Key to `auth.users.id`)
    - ※ UI上での関連付け設定が必要
  - `content` (Type: `text`, Not Nullable)
  - `created_at` (Type: `timestamptz`, Default: `now()`)
- 設定を保存し、テーブルを作成した。
- `posts.user_id` と `profile.id` (または `auth.users.id`) の間に外部キー制約を設定した (これにより後のデータ結合が可能になる)。

### 投稿フォーム実装 (`PostForm.tsx`)

- **ファイル:** `components/PostForm.tsx`
- **変更箇所:** クライアントコンポーネント化、`useState` 追加、`handleSubmit` 関数実装、アイコン表示用 `useEffect` 追加。
- **内容:**
  - `'use client';` を追加。
  - `useState` でテキストエリアの入力内容 (`content`) とユーザーアイコンパス (`userIcon`) を管理。
  - `utils/supabase/client.ts` の `createClient` を使用。
  - `useEffect` を追加: コンポーネントマウント時に `supabase.auth.getUser()` でユーザーIDを取得し、その **`user.id` を使って `profile` テーブルから `icon` カラムのデータを取得** し、`userIcon` state にセット。
  - `handleSubmit` 関数で以下を実行:
    - `supabase.auth.getUser()` でログインユーザーを確認。
    - 入力内容 (`content`) が空でないかチェック。
    - `supabase.from('posts').insert()` で `user_id` と `content` を `posts` テーブルに挿入。
    - 成功時にテキストエリアをクリアし、アラートを表示。
    - 失敗時にエラーをコンソールとアラートで表示。
  - アイコン表示エリアを修正: `userIcon` state の値が有効な場合に `next/image` を使ってユーザーアイコンを表示
  - テキストエリアの `value` と `onChange` を `content` state に紐付け。
  - 「ポストする」ボタンの `onClick` に `handleSubmit` を設定し、`disabled` 属性で空投稿を防止。
- **確認方法:** ログイン状態でホーム画面を表示し、投稿フォームの左側に自分のアイコンが表示されること、テキストエリアに入力して「ポストする」ボタンをクリックすると、Supabase の `posts` テーブルにデータが追加され、成功アラートが表示されることを確認する。

### タイムライン表示実装 (`app/page.tsx`)

- **ファイル:** `app/page.tsx`
- **変更箇所:** `async` 関数化、データ取得ロジック追加、`Post` コンポーネントへのデータ渡し変更。
- **内容:**
  - `async function home()` に変更。
  - `utils/supabase/server.ts` の `createClient` を `await` 付きで呼び出し。
  - `supabase.from('posts').select('*, profile: profile(*)')` を使用して、`posts` テーブルの全データと、関連する `profile` テーブルの全データを結合して取得。
    - `profile: profile(*)` の部分は、`posts.user_id` を外部キーとして `profile` テーブルを結合し、結果を `profile` という名前のネストされたオブジェクトとして取得する指定。
  - `.order('created_at', { ascending: false })` で投稿を新しい順に並び替え。
  - 取得したデータ (またはエラー時は空配列) を `Post` コンポーネントの `posts` プロパティに渡す。
  - ダミーデータのインポート (`@/data/posts`) を削除。

### 型定義の共通化 (`types/index.ts`)

- **目的:** アプリケーション全体で使用する型定義を共通の場所にまとめる。
- **ファイル:** `types/index.ts` (新規作成または編集)
- **内容:**
  - `Profile` インターフェースを定義。
  - `posts` テーブルと `profile` テーブルを結合したデータの型として `PostWithProfile` インターフェースを定義し、`export` する。
- **適用:**
  - `app/page.tsx`: `PostWithProfile` のローカル定義を削除し、`@/types` からインポート。
  - `components/Post.tsx`: `PostWithProfile` のインポート元を `@/app/page` から `@/types` に変更。

### 投稿表示コンポーネント修正 (`Post.tsx`)

- **ファイル:** `components/Post.tsx`
- **変更箇所:** Props 型変更、`useState`/`useEffect` 削除、表示ロジック更新、インタラクション機能削除。
- **内容:**
  - Props (`posts`) の型を `PostData[]` から `PostWithProfile[]` (`@/types` からインポート) に変更。
  - 内部の `useState` (`postsState`) とそれを更新する `useEffect` を削除し、Props の `posts` を直接 `map` するように変更。
  - 投稿者の表示を `post.profile.name`, `post.profile.icon`, `post.profile.id` (または `post.user_id`) を使うように修正 (存在しない場合のフォールバック含む)。
  - 投稿時間の表示を `post.created_at` をフォーマット (`formatTimeAgo` 関数を追加) して表示するように修正。
  - いいね、リツイート、コメント関連の State、イベントハンドラ、カウント表示などを削除またはコメントアウト (ボタンの見た目のみ残す)。
- **確認方法:** ホーム画面を表示し、Supabase に保存されている投稿が、投稿者の名前・アイコン・投稿内容・投稿時間と共に正しく表示されることを確認する。

#### `Post.tsx` リンク構造の修正 (ネスト解消)

- **目的:** 投稿全体が詳細ページへのリンク、アイコンがプロフィールページへのリンクとなっていることで発生する `<a>` タグのネストエラー (`<a>` cannot contain a nested `<a>`) を解消する。
- **変更箇所:** `Post.tsx` の JSX 構造。
- **内容:**
  - 各投稿を囲む要素を `div` に変更し、スタイル (境界線、ホバー効果) と `key` を適用。
  - プロフィールアイコン部分をプロフィールページ (`/[userId]`) への `<Link>` で囲む。
  - アイコン以外の右側コンテンツエリア (ユーザー名、投稿内容、アクションボタン) を投稿詳細ページ (`/[userId]/[postId]`) への `<Link>` で囲む。
  - アクションボタン (`コメント`, `リツイート`, `いいね`) の `onClick` ハンドラに `e.stopPropagation()` を追加し、ボタンクリック時にコンテンツエリアのリンク遷移が発生しないようにする。
- **確認方法:**
  - コンソールにネストエラーが表示されないことを確認。
  - プロフィールアイコンをクリックすると投稿者のプロフィールページに遷移することを確認。
  - 投稿のコンテンツエリア (アイコン以外) をクリックすると投稿詳細ページに遷移することを確認。
  - アクションボタンをクリックしてもページ遷移しないことを確認。

### 投稿詳細ページの実装 (`app/[userId]/[postId]/page.tsx`)

- **目的:** 個別の投稿とその返信（未実装）を表示するページを作成する。
- **変更箇所:** `app/[userId]/[postId]/page.tsx` (新規作成・修正)
- **内容:**
  - **初期実装 (課題):** 当初、クライアントコンポーネントとして作成し、ダミーデータ (`@/data/posts`) を使用して投稿を表示しようとした。しかし、ダミーデータに存在しない `postId` でアクセスすると `notFound()` が呼ばれ、404 エラーが発生した。
  - **サーバーコンポーネントへの移行:** 404 エラーを解決するため、サーバーコンポーネント (`async function`) に変更。
    - `@/utils/supabase/server` の `createClient` を `await` 付きで使用。
    - URL パラメータ (`params.postId`) を使って Supabase から `posts` テーブル (関連する `profile` も結合) のデータを取得。
    - データが見つからない場合に `notFound()` を呼び出すように修正。
    - JSX で表示するデータを Supabase から取得したものに置き換え。
  - **クライアントコンポーネントへの再変更 (最終):** ユーザーの要望により、再度クライアントコンポーネント (`"use client"`) に変更。
    - `@/utils/supabase/client` の `createClient` を使用。
    - `useParams` フックで `postId` を取得。
    - `useState` フックで投稿データ (`post`)、ローディング状態 (`loading`)、エラー状態 (`error`) を管理。
    - `useEffect` フック内で、`postId` に基づいて Supabase から非同期で投稿データを取得。
    - データ取得中はローディング表示、取得失敗時や投稿が見つからない場合はエラーメッセージを表示するようにした (クライアントコンポーネントでの `notFound()` 使用を回避)。
    - JSX は `loading`, `error`, `post` の状態に応じて表示を切り替え。
    - 投稿者情報、内容、日時は取得した `post` State を使用して表示。
    - 返信フォーム (`ReplyForm`) コンポーネントを配置 (返信表示自体は未実装)。
- **確認方法:**
  - 存在する投稿 ID を含む URL (`/[userId]/[postId]`) にアクセスすると、ローディング表示の後、投稿の詳細情報 (投稿者アイコン・名前、内容、日時) が表示されることを確認。
  - 存在しない投稿 ID でアクセスすると、「投稿が見つかりません」または「投稿の読み込みに失敗しました」というエラーメッセージが表示されることを確認。
  - 404 エラーが発生しないことを確認。

## ☆2: 主要機能の実装

### 1. フォロー機能 (バックエンド準備)

#### Supabase テーブル作成 (`follows`)

- Supabase SQL Editor を使用して `follows` テーブルを新規作成した。
- カラム構成:
  - `id` (BIGINT, Primary Key, Generated by default as identity)
  - `follower_id` (UUID, Foreign Key to `public.profile(id)`, Not Nullable, On delete cascade)
  - `following_id` (UUID, Foreign Key to `public.profile(id)`, Not Nullable, On delete cascade)
  - `created_at` (TIMESTAMPTZ, Default: `now()` at UTC, Not Nullable)
- `follower_id` と `following_id` の組み合わせに対する UNIQUE 制約を追加 (`follows_unique`)。

#### DB 関数作成 (フォロー/フォロワー数カウント、フォロー状態チェック)

- Supabase SQL Editor を使用して以下の PL/pgSQL 関数を作成した。
- `get_following_count(user_profile_id uuid)`: 指定ユーザーのフォロー数を返す。
- `get_followers_count(user_profile_id uuid)`: 指定ユーザーのフォロワー数を返す。
- `is_following(user_follower_id uuid, user_following_id uuid)`: フォロー状態 (`true`/`false`) を返す。
- すべての関数で `SECURITY DEFINER` を設定。

```sql
-- ユーザーがフォローしている人数（フォロー中の数）を取得する関数
CREATE OR REPLACE FUNCTION public.get_following_count(user_profile_id uuid)
RETURNS bigint -- 戻り値は「人数」なので bigint 型
LANGUAGE plpgsql
SECURITY DEFINER -- 関数作成者の権限で実行される（RLSの回避が可能）
AS $$
BEGIN
  -- follows テーブルから、自分（follower_id）がフォローしている数を数える
  RETURN (
    SELECT count(*)
    FROM public.follows
    WHERE follower_id = user_profile_id
  );
END;
$$;

-- ユーザーをフォローしている人数（フォロワー数）を取得する関数
CREATE OR REPLACE FUNCTION public.get_followers_count(user_profile_id uuid)
RETURNS bigint -- 戻り値は人数なので bigint 型
LANGUAGE plpgsql
SECURITY DEFINER -- 関数作成者の権限で実行される（RLS回避が可能）
AS $$
BEGIN
  -- follows テーブルから、自分（following_id）をフォローしているユーザー数を数える
  RETURN (
    SELECT count(*)
    FROM public.follows
    WHERE following_id = user_profile_id
  );
END;
$$;

-- 指定されたユーザーが、別のユーザーをフォローしているかを確認する関数
CREATE OR REPLACE FUNCTION public.is_following(user_follower_id uuid, user_following_id uuid)
RETURNS boolean -- 戻り値は true または false（フォローしているかどうか）
LANGUAGE plpgsql
SECURITY DEFINER -- 関数作成者の権限で実行（RLS回避が可能）
AS $$
BEGIN
  -- follows テーブルに該当のフォロー関係が存在するかを確認する
  RETURN EXISTS (
    SELECT 1
    FROM public.follows
    WHERE follower_id = user_follower_id AND following_id = user_following_id
  );
END;
$$;

-- SECURITY DEFINER は、この関数が呼び出されたときに「関数の作成者」の権限で実行されることを意味する
-- 通常のユーザーには SELECT 権限がなくても、この関数を通せば読み取り可能
-- Row Level Security (RLS) を有効にした状態で、読み取り専用関数として活用するのが一般的
```

- **確認方法:** Supabase ダッシュボードの Table Editor で `follows` テーブルが作成されていること、SQL Editor で上記の関数がエラーなく作成されていることを確認する。

### 2. フォロー機能 (フロントエンド実装)

#### プロフィールページ (`app/[userId]/page.tsx`) の改修

- **目的:** バックエンドで作成したフォロー/アンフォロー/状態確認 API と連携し、プロフィールページでフォロー機能を実現する。
- **変更箇所:** `app/[userId]/page.tsx`
- **内容:**
  - **State 変数追加:**
    - `isFollowing` (`boolean`): ログインユーザーが表示中ユーザーをフォローしているか。
    - `isLoadingFollow` (`boolean`): フォロー/アンフォロー API 呼び出し中のローディング状態。
  - **`useEffect` フックによるフォロー状態取得:**
    - 既存のデータ取得処理 (`fetchData`) 内で、プロフィール情報 (`profile`) とログインユーザー情報 (`user`) を取得後、かつ表示対象が自分自身でない (`profile.id !== user.id`) 場合に実行。
    - `fetch` API を使用して `/api/users/${profile.id}/follow_status` (GET) エンドポイントを呼び出す。
    - レスポンス ( `{ isFollowing: boolean }` ) をもとに `isFollowing` State を更新。
    - エラーハンドリングを追加。
  - **フォロー/アンフォローボタン UI:**
    - プロフィール情報エリアにボタンを追加。
    - ログインユーザーがプロフィールのオーナーでない (`!isOwner`) 場合にのみ表示。
    - ボタンのテキストは `isFollowing` に応じて「フォロー中」「フォローする」を切り替え。
    - ボタンのスタイルも `isFollowing` と `isLoadingFollow` に応じて変更（ローディング中、フォロー中、フォロー前）。
    - `isLoadingFollow` が `true` の間は `disabled` 属性を付与。
    - `onClick` イベントに `handleFollowToggle` 関数を紐付け。
  - **フォロー/アンフォロー処理 (`handleFollowToggle` 関数):**
    - ボタンクリック時に実行される `async` 関数。
    - 処理開始時に `isLoadingFollow` を `true` に設定。
    - `isFollowing` の状態に応じて、`fetch` API を使用して以下のエンドポイントを呼び出す。
      - フォロー解除 ( `isFollowing === true` ): `DELETE /api/users/${userId}/unfollow`
      - フォロー実行 ( `isFollowing === false` ): `POST /api/users/${userId}/follow`
    - API 呼び出しのレスポンス (`response.ok`) を確認。
    - 成功した場合:
      - `isFollowing` State を反転させる。
      - `followerCount` State をインクリメント/デクリメントする。
    - エラーが発生した場合はコンソールにエラーを出力。
    - `finally` ブロックで `isLoadingFollow` を `false` に戻す。
- **確認方法:**
  - 他のユーザーのプロフィールページで「フォローする」ボタンが表示され、クリックすると API が呼ばれて「フォロー中」に変わり、フォロワー数が増えることを確認。
  - 「フォロー中」ボタンをクリックすると API が呼ばれて「フォローする」に戻り、フォロワー数が減ることを確認。
  - 処理中はボタンが無効化され「処理中...」と表示されることを確認。
  - 自分のプロフィールページではフォローボタンが表示されないことを確認。

#### 投稿詳細ページへのフォローボタン追加

- **目的:** 投稿詳細ページで、投稿者のフォロー状態を表示し、フォロー/アンフォロー操作を可能にする。
- **変更箇所:** `app/[userId]/[postId]/page.tsx`
- **内容:**
  - **State 変数追加:** プロフィールページと同様に、`isFollowing` (`boolean`) と `isLoadingFollow` (`boolean`) の State を追加。
  - **フォロー状態取得:** 既存の `useEffect` フック内で、投稿データ (`post`) の取得に成功した後、かつ投稿者 (`post.user_id`) がログインユーザー自身でない場合に、`fetch` を使用して `/api/users/${post.user_id}/follow_status` (GET) を呼び出し、`isFollowing` State を更新。
  - **フォロー/アンフォローボタン UI:**
    - 投稿者情報の右側（ユーザー名の隣など）にボタンを追加。
    - 投稿者がログインユーザー自身でない場合にのみ表示。
    - テキスト、スタイル、`disabled` 属性はプロフィールページと同様に `isFollowing` と `isLoadingFollow` に基づいて動的に設定。
    - `onClick` イベントに `handleFollowToggle` 関数を紐付け。
  - **フォロー/アンフォロー処理 (`handleFollowToggle` 関数):**
    - プロフィールページで実装した `handleFollowToggle` 関数と同様のロジックを実装。
    - `isFollowing` の状態に応じて `fetch` で `DELETE /api/users/${post.user_id}/unfollow` または `POST /api/users/${post.user_id}/follow` を呼び出す。
    - API 呼び出しの成功/失敗に応じて `isFollowing` State を更新し、`isLoadingFollow` を制御する。
- **確認方法:**
  - 他のユーザーの投稿詳細ページを開いた際、投稿者名の横に「フォローする」または「フォロー中」ボタンが表示されることを確認。
  - ボタンをクリックすると、プロフィールページと同様にフォロー/アンフォローが実行され、ボタン表示が切り替わることを確認。
  - 自分の投稿詳細ページではボタンが表示されないことを確認。