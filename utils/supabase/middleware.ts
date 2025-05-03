import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js のミドルウェア関数
 * 毎回のリクエスト時に Supabase の認証セッションを確認・更新します。
 *
 * 役割：
 * - Cookieを元にSupabaseクライアントを初期化
 * - ユーザー情報を取得して、認証済みかどうかを確認
 * - Cookieが更新されていれば、レスポンスに反映
 * - 未認証ユーザーであれば、ログインページへリダイレクト
 */

export async function updateSession(request: NextRequest) {
  // 初期レスポンスオブジェクトを作成（この後でセッションのCookie情報を反映して再構築されます）
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Supabaseのクライアントを作成（リクエストのCookieを使って初期化）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * リクエストに含まれるすべてのCookieを取得
         * Supabaseが内部でセッション情報の取得に使用
         */
        getAll() {
          return request.cookies.getAll();
        },

        /**
         * Supabaseが設定しようとしているCookieをレスポンスに反映
         * セッション情報などがここでブラウザ側に送信される
         */
        setAll(cookiesToSet) {
          // 一時的にリクエスト内のCookieを更新（内部状態の保持のため）
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Cookieの更新を反映するため、レスポンスを再生成
          supabaseResponse = NextResponse.next({
            request,
          });

          // 実際にレスポンスとして返すオブジェクトに、Cookieをセット（options含む）
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Supabaseから現在のユーザー情報を取得（ログイン状態を確認するため）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザーが未ログインで、かつアクセス先がログインページや認証系ページでない場合
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // ログインページへリダイレクトする処理
    const url = request.nextUrl.clone(); // 現在のURLをコピー
    url.pathname = "/login"; // パスをログインページに書き換え
    return NextResponse.redirect(url); // ログインページへリダイレクト
  }

  // セッションを維持するため、必ずsupabaseResponseを返す
  return supabaseResponse;
}
