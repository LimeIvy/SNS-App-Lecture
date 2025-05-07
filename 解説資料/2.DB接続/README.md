# チャプター2: DB接続 (Supabase)

## 1. このチャプターの目標

このチャプターでは、データベースを準備し、プロジェクトから接続できるようにします。具体的には以下のことができるようになるのが目標です。

- Supabaseというサービスを使って、新しいデータベースプロジェクトを作成する。
- Next.jsアプリとSupabaseデータベースを繋ぐための「鍵」となる情報を取得し、安全に保管する方法を学ぶ。
- Next.jsアプリ内でSupabaseとやり取りするための準備として、特別なプログラム（ユーティリティ）を作成する。

## 2. 座学: データを保存する仕組み

データベースやSupabase、APIキーと環境変数については、以下の資料で詳しく解説しています。
まずはこちらを読んで、基本的な知識を身につけましょう。

[➡️ 座学: DB接続とSupabase](./座学-DB接続とSupabase.md)

## 3. 実装: Supabaseプロジェクトと接続しよう

### 3.1. Supabaseプロジェクトの新規作成

まずはSupabaseのウェブサイトで、私たちのX-Cloneアプリ用のプロジェクトを作りましょう。

1.  **Supabase公式サイトにアクセス:** [Supabase](https://supabase.com/) を開き、アカウント登録またはログインします。
    （画像イメージ: `../../資料/1. DB接続/image.png` - Supabaseのトップページ）
2.  **新しいプロジェクトを作成:** ダッシュボードで「New project」ボタンをクリックします。
    （画像イメージ: `../../資料/1. DB接続/image6.png` - Supabaseダッシュボードの「New project」ボタン）
3.  **組織を選択 (または作成):** 既存のOrganization（組織）を選ぶか、新しく作成します。
4.  **プロジェクト情報を入力:**
    - **Name:** プロジェクト名を入力します（例: `x-clone-tutorial`）。
    - **Database Password:** 強力なデータベースパスワードを生成するか、自分で設定します。**このパスワードは必ず安全な場所に控えておいてください。**
    - **Region:** プロジェクトのサーバーが存在する地域を選びます。日本のユーザーが多ければ `Japan (Tokyo)` が良いでしょう。
    - **Pricing Plan:** 無料の `Free` プランを選択します。
      （画像イメージ: `../../資料/1. DB接続/image2.png` - プロジェクト作成フォームの各入力欄）
5.  「Create new project」ボタンをクリックします。プロジェクトの準備が始まるので、数分待ちます。

### 3.2. API URLとanonキーの取得

プロジェクトの準備ができると、ダッシュボードが表示されます。
Next.jsアプリからこのSupabaseプロジェクトに接続するために必要な情報を取得します。

1.  左側のメニューから「Project Settings」（歯車のアイコン）を選び、その中の「API」セクションに移動します。
    （画像イメージ: `../../資料/1. DB接続/image3.png` - Supabaseプロジェクト設定のAPIセクションへの導線）
2.  「Project API keys」という項目の中に、以下の2つの重要な情報があります。
    - **URL (Project URL):** これがSupabaseプロジェクトの接続先アドレスです。
    - **anon public (Project API Key anon public):** これが匿名ユーザー（ログインしていないユーザーも含む）が安全に使えるAPIキーです。
      （画像イメージ: `../../資料/1. DB接続/image4.png` - API URLとanonキーが表示されている箇所）
      これらの値をコピーしておきます。

### 3.3. Next.jsプロジェクトに環境変数を設定

コピーしたSupabaseのURLとanonキーを、Next.jsプロジェクトに安全に設定します。

1.  VS Codeで `X-Clone` プロジェクトを開きます。
2.  プロジェクトのルートディレクトリ（`app` や `package.json` と同じ階層）に、`.env.local` という名前のファイルを新規作成します。
    もし `.env.local.example` というファイルがあれば、それをコピーして `.env.local` にリネームしてもOKです。
3.  `.env.local` ファイルに以下のように記述し、`YOUR_SUPABASE_URL` と `YOUR_SUPABASE_ANON_KEY` の部分を、先ほどSupabaseからコピーした実際のURLとanonキーに置き換えます。

    ```.env.local
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

    **注意:**

    - `NEXT_PUBLIC_` という接頭辞がついている変数は、ブラウザ側（クライアントサイド）のコードからもアクセス可能になります。Supabaseのanonキーは公開されても安全なように設計されていますが、他の秘密キー（例えばSupabaseのservice*roleキーなど）を扱う場合は `NEXT_PUBLIC*` を付けずにサーバーサイド専用にすることが重要です。
    - ファイルを保存したら、一度開発サーバーを再起動（ターミナルで `Ctrl+C` を押して停止し、再度 `npm run dev`）すると、新しい環境変数が読み込まれます。

4.  **`.gitignore` ファイルの確認:**
    プロジェクトルートにある `.gitignore` ファイルを開き、`.env.local` という行が含まれていることを確認してください。これにより、この大事な情報が含まれるファイルが誤ってGitHubなどに公開されるのを防ぎます。通常、`git clone` した時点で適切に設定されています。

### 3.4. Supabase関連ライブラリのインストール

Next.jsアプリからSupabaseとやり取りするために必要なJavaScriptライブラリをインストールします。これらは `package.json` に既に記載されているはずなので、`npm install` (または `yarn install`) を実行した際に一緒にインストールされているはずですが、念のため確認・実行します。

1.  ターミナルで、カレントディレクトリがプロジェクトルート (`X-Clone` フォルダの直下) にいることを確認します。
2.  以下のコマンドを実行します。
    ```bash
    npm install @supabase/supabase-js @supabase/ssr
    ```
    - `@supabase/supabase-js`: Supabaseとやり取りするための主要なライブラリです。
    - `@supabase/ssr`: Next.jsのようなサーバーサイドレンダリング環境でSupabaseの認証をうまく扱うための補助ライブラリです。

### 3.5. Supabaseクライアントユーティリティの作成

Supabaseとやり取りするための初期設定や関数をまとめた「ユーティリティ（便利道具）ファイル」を作成します。これにより、アプリの様々な場所から簡単にSupabaseの機能を利用できるようになります。

プロジェクトの `utils` フォルダ（なければ作成）の中に `supabase` というフォルダを作り、その中に以下の2つのファイルを作成します。

```
X-Clone/
└── utils/
    └── supabase/
        ├── client.ts
        └── server.ts
```

#### 3.5.1. クライアントコンポーネント用 (`utils/supabase/client.ts`)

ブラウザ側で動作するコンポーネント（例: ユーザーの操作に応じて動的に見た目が変わる部分）からSupabaseを利用する際に使います。

```typescript
// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // .env.local から環境変数を取得
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
```

- `createBrowserClient` 関数を使って、ブラウザ環境用のSupabaseクライアントを作成します。
- `process.env.NEXT_PUBLIC_SUPABASE_URL` と `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` で、`.env.local` に設定した値を取得しています。末尾の `!` は「この値は絶対に存在するはずだ」とTypeScriptに伝えるためのものです（Non-null assertion operator）。

#### 3.5.2. サーバーコンポーネント・サーバーアクション・APIルート用 (`utils/supabase/server.ts`)

サーバー側で動作する処理（例: ページが読み込まれる前のデータ取得、APIエンドポイントの処理）からSupabaseを利用する際に使います。

```typescript
// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies(); // cookies() は await 不要な場合がありますが、プロジェクトに合わせてください。

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // エラーが発生した場合（たとえばServer Componentで呼び出された場合など）、
            // 何もせずスルーする。ミドルウェアなどでセッションを更新している場合は問題ない。
          }
        },
      },
    }
  );
}
```

- `createServerClient` 関数を使って、サーバー環境用のSupabaseクライアントを作成します。
- ユーザーの認証状態を管理するためにクッキー (`cookies`) の処理が含まれており、`getAll` と `setAll` を使ってNext.jsのCookieストアと連携します。
- `next/headers` から `cookies` をインポートして使用します。

**これで、Next.jsプロジェクトからSupabaseに接続するための準備が整いました！**

実際にデータベースにデータを保存したり読み取ったりするのは、次のチャプター以降で行います。今はまず、エラーなくこれらのファイルが作成でき、開発サーバーが起動できることを確認しましょう。

---

お疲れ様でした！これでチャプター2は終了です。
データベースという強力な仲間を得るための第一歩を踏み出しました。次のチャプターでは、このデータベースを使ってユーザーが登録したりログインしたりする「認証」の仕組みを作っていきます。
