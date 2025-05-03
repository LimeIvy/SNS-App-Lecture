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
- ターミナルで `npm install @supabase/supabase-js` を実行し、Supabase Client ライブラリをインストールした。

#### 初期コミット

- `.gitignore` に `.env.local` が含まれていることを確認した。
- `git add .` で変更をステージングした。
- `git commit -m "feat: initial project setup with Next.js, TypeScript, Tailwind, Supabase"` でコミットした。
- `git push origin main` でリモートリポジトリにプッシュした。
