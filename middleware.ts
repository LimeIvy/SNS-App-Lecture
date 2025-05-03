import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

/**
 * Next.js の Middleware 関数
 * すべてのリクエストに対して Supabase のセッションを確認・更新する処理を呼び出す
 *
 * @param request - ブラウザやクライアントからのリクエスト情報
 * @returns Supabaseのセッション更新を実行した結果のレスポンス
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request); // Supabaseセッションを更新
}

/**
 * Middlewareの適用範囲を設定するオブジェクト
 *
 * `matcher` は、どのURLパスに対して middleware を実行するかを指定する。
 * 下記の設定では、以下のようなファイルには適用「しない」：
 * - `_next/static` や `_next/image` のようなNext.jsの内部ファイル
 * - `favicon.ico`
 * - 画像ファイル（svg, png, jpg, jpeg, gif, webp）
 *
 * それ以外のすべてのルート（ページ）に対して `middleware` が動作する。
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
