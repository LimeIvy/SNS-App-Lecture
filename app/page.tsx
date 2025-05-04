import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { PostForm } from "@/components/PostForm";
import Post from "@/components/Post";
import { createClient } from "@/utils/supabase/server";
import { PostWithProfile } from "@/types";

export default async function home() {
  const supabase = await createClient();

  // Supabase (PostgREST) では、テーブル間に外部キー関係が設定されていれば、
  // .select() を使って関連テーブルのデータを一度に取得できます。
  const { data: posts, error } = await supabase
    .from("posts")
    .select<
      "*, profile: profile(*)", // 第1型引数: selectクエリ文字列の型リテラル (型推論用)
      PostWithProfile // 第2型引数: 取得結果の各要素の型 (types/index.ts で定義)
    >("*, profile: profile(*)")
    // 'created_at' (投稿日時) カラムの降順 (新しいものが先頭) で並び替え
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts with profiles:", error.message);
  }

  return (
    <div className="flex justify-center bg-black">
      {/* コンテンツラッパー - 大画面ではコンテンツを中央に配置 */}
      <div className="flex w-full max-w-7xl">
        {/* レフトサイドバー */}
        <div className="w-1/5 xl:w-[275px]">
          <LeftSidebar />
        </div>

        {/* メインコンテンツ */}
        <div className="min-h-screen w-3/5 border-x border-gray-800 xl:w-[600px]">
          {/* ヘッダー */}
          <div className="bg-opacity-80 sticky top-0 z-10 border-b border-gray-800 bg-black p-4 backdrop-blur-md">
            <h1 className="text-xl font-bold text-white">ホーム</h1>
          </div>
          {/* 投稿フォーム */}
          <PostForm />
          {/* 投稿一覧 - Supabaseから取得したデータを渡す */}
          <Post posts={posts || []} />
        </div>

        {/* ライトサイドバー */}
        <div className="w-1/5 xl:w-[350px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
