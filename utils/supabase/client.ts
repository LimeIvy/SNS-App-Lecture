import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // 環境変数から Supabase の URL と Anon Key を取得してクライアントを作成
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
