// SupabaseのSSR（サーバーサイドレンダリング）用クライアントを作成する関数をインポート
import { createServerClient } from "@supabase/ssr";

// Next.jsのcookies関数をインポート（サーバー側でCookieにアクセスするために使用）
import { cookies } from "next/headers";

// Supabaseクライアントを作成する非同期関数
export async function createClient() {
  // Cookieストアを取得（ここで取得したCookieにセッション情報などが含まれる）
  const cookieStore = await cookies();

  // Supabaseクライアントを作成して返す
  return createServerClient(
    // SupabaseのURLと匿名キーを環境変数から取得
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Cookieの読み書きを定義（Supabaseがセッション情報を扱うために使用）
      cookies: {
        // クライアントからすべてのCookieを取得する関数
        getAll() {
          return cookieStore.getAll();
        },
        // Supabaseが必要とするCookieをサーバーにセットする関数
        setAll(cookiesToSet) {
          try {
            // 取得したすべてのCookie情報をcookieStoreに書き込む
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // エラーが発生した場合（たとえばServer Componentで呼び出された場合など）、
            // 何もせずスルーする。ミドルウェアなどでセッションを更新している場合は問題ない。
          }
        },
      },
    }
  );
}
