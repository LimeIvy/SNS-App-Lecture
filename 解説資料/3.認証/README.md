# チャプター3: 認証機能の実装 (Supabase Auth)

## 1. このチャプターの目標

このチャプターでは、X-Cloneアプリに「あなたは誰？」を識別し、ユーザーごとに異なる体験を提供するための第一歩となる「認証機能」を実装します。具体的には以下のことができるようになるのが目標です。

- 新しいユーザーがメールアドレスとパスワードを使ってアプリに登録できるようにする（新規登録）。
- 登録済みのユーザーがログインできるようにする（ログイン）。
- ログインしているユーザーがログアウトできるようにする（ログアウト）。
- ログインしていないと見れないページへのアクセスを制限する仕組み（Middleware）の基本を導入する。

## 2. 座学: アプリの「カギ」を持つ仕組み

認証の基本的な考え方や、今回使用するSupabase Auth、パスワードの安全性、Middlewareについては、以下の資料で詳しく解説しています。
実装を始める前に、ぜひ一度目を通してみてください。

[➡️ 座学: アプリの「カギ」を持つ仕組み（認証）](./座学-認証とは.md)

## 3. 実装: 認証機能を一つずつ作ろう

### 3.1. Supabaseの認証設定を確認しよう

まず、Supabase側でメールアドレスとパスワードを使った認証が有効になっているか、また開発をスムーズに進めるための設定を確認します。

1.  **Supabaseプロジェクトダッシュボードを開く:** チャプター2で作成したSupabaseプロジェクトにアクセスします。
2.  **認証設定へ移動:** 左側のメニューから「Authentication」を選び、その中の「Providers」セクションに移動します。
    （画像イメージ: `../../資料/2. 認証/1.png` - Supabase Auth Providersページへの導線）
3.  **Emailプロバイダーの確認:** 「Email」が有効 (Enabled) になっていることを確認します。通常はデフォルトで有効です。
4.  **メール確認を一時的に無効化 (開発用):**
    - 同じ「Providers」セクションの「Email」プロバイダーの設定を開きます（通常、トグルスイッチの隣にある設定アイコンやリンク）。
    - 「Confirm email」という項目のトグルスイッチを **オフ** にします。これにより、新規登録時に確認メールのステップを省略でき、開発中のテストが容易になります。
    - **注意:** 本番環境のアプリケーションでは、セキュリティのため「Confirm email」を有効にすることが強く推奨されます。
      （画像イメージ: `../../資料/2. 認証/screenshot_confirm_email_disabled.png` - Confirm emailを無効にする設定画面のスクリーンショットを想定。もしなければ `1.png` を流用し、説明で補足）
    - 設定を変更したら、忘れずに保存します。

### 3.2. ユーザー登録ページ (UI作成)

ユーザーがアカウントを作成するための入力フォームとページを作成します。

- **ファイルパス:** `app/register/page.tsx` (まだなければ新規作成)

```tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
// import Image from "next/image"; // ロゴを表示する場合はコメントアウトを解除
// import Link from "next/link"; // ログインページへのリンクが必要な場合はコメントアウトを解除

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      alert("名前を入力してください。");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      alert(`登録エラー: ${error.message}`);
    } else {
      alert("登録が完了しました。ホームページに移動します。");
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-xs">
        {/* <Image src="/X.png" alt="logo" width={60} height={60} className="mx-auto mb-6" /> */}
        <h1 className="text-2xl font-bold mb-6 text-center">アカウントを作成</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              名前
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-2 rounded bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 rounded bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              パスワード (6文字以上)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full p-2 rounded bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            アカウントを作成する
          </button>
        </form>
        {/* <p className="mt-4 text-center text-sm">
          アカウントをお持ちですか？ <Link href="/login" className="text-blue-400 hover:text-blue-300">ログイン</Link>
        </p> */}
      </div>
    </div>
  );
}
```

- **ポイント:**
  - `'use client';` をファイルの先頭に記述して、クライアントコンポーネントとしています。
  - `useState` で名前、メールアドレス、パスワードの状態を管理します。
  - `useRouter` で登録成功後のページ遷移を行います。
  - `createClient` でSupabaseクライアントを取得します。
  - `handleRegister` 関数で `supabase.auth.signUp` を呼び出し、ユーザー登録処理を行います。
    - `options.data` を使うと、`auth.users` テーブルの `raw_user_meta_data` カラムに任意の情報を保存できます。ここに名前を保存しておき、後述するDBトリガーで `profile` テーブル作成時に利用します。
  - エラーがあれば表示し、成功すればホームページにリダイレクトします。
  - `router.refresh()` は、リダイレクト後にサーバー側の状態（特に認証状態に関連するリダイレクトなど）を更新するために呼び出しています。

（画像イメージ: `../../資料/2. 認証/2.png` - 作成した新規登録ページのスクリーンショット）

### 3.3. ログインページ (UI作成)

登録済みのユーザーがログインするためのページを作成します。

- **ファイルパス:** `app/login/page.tsx` (まだなければ新規作成)

```tsx
// app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        console.error("Sign in error:", signInError.message);
        return;
      }

      alert('ログインしました。ホームページに移動します。');
      router.push('/'); // ホームページへリダイレクト
      router.refresh(); // サーバーコンポーネントを再読み込みさせるため

    } catch (err: any) {
      setError('予期せぬエラーが発生しました。');
      console.error("Unexpected error during sign in:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            ログイン
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          アカウントをお持ちでないですか？{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300">
            新規登録はこちら
          </a>
        </p>
      </div>
    </div>
  );
}
```

- **ポイント:**
  - 登録ページとほぼ同様の構成です。
  - `handleLogin` 関数で `supabase.auth.signInWithPassword` を呼び出してログイン処理を行います。
  - 成功すればホームページにリダイレクトします。

（画像イメージ: `../../資料/2. 認証/3.png` - 作成したログインページのスクリーンショット）

### 3.4. ログアウト機能の実装

アプリからログアウトするためのボタンと処理を追加します。
ここでは仮として、左サイドバーにログアウトボタンを設置します。

- **ファイルパス:** `components/sidebar/LeftSidebar.tsx` (なければ新規作成、または既存のものを修正)

```tsx
// components/sidebar/LeftSidebar.tsx
"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
// 他に必要なインポートがあれば追加 (例: Link, ユーザー情報表示用フックなど)

export function LeftSidebar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert('ログアウトに失敗しました。');
      return;
    }
    alert('ログアウトしました。');
    router.push('/login'); // ログインページへリダイレクト
    router.refresh();
  };

  // ログイン状態によって表示を変える場合は、ここでユーザー情報を取得するロジックが必要になります。
  // 例えば、useEffect と useState を使ってユーザー情報を保持し、
  // ユーザーがいればプロフィール情報やログアウトボタンを、いなければログイン/登録リンクを表示するなど。
  // このチャプターではまずログアウト機能の実装に集中します。

  return (
    <aside className="h-screen w-64 bg-gray-800 p-4 text-white fixed top-0 left-0">
      <nav>
        <ul>
          <li className="mb-2">
            <a href="/" className="hover:text-blue-300">ホーム</a>
          </li>
          {/* 他のナビゲーションリンク */}
        </ul>
      </nav>

      {/* ログアウトボタン (仮) */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
        >
          ログアウト
        </button>
      </div>
    </aside>
  );
}
```

- **ポイント:**
  - `handleLogout` 関数で `supabase.auth.signOut()` を呼び出してログアウトします。
  - 成功後、ログインページにリダイレクトします。
  - この `LeftSidebar` コンポーネントを、アプリ全体のレイアウトファイル (`app/layout.tsx`) で読み込んで表示するようにします。

**`app/layout.tsx` での `LeftSidebar` の組み込み例:**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar"; // パスは適宜調整

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X-Clone",
  description: "X-Clone by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-900 flex`}>
        <LeftSidebar />
        <main className="flex-1 p-4 ml-64"> {/* ml-64 はサイドバーの幅に合わせる */}
          {children}
        </main>
      </body>
    </html>
  );
}
```

（画像イメージ: `
