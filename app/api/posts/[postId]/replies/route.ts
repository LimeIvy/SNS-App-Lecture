import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: routeParamsFromContext }: { params: { postId: string } }
) {
  const supabase = await createClient();

  const params = await routeParamsFromContext;

  // 1. 返信を取得したい投稿のID
  const targetPostId = params.postId;

  if (!targetPostId) {
    return new NextResponse("Post ID is required", { status: 400 });
  }

  try {
    // 2. replies テーブルからデータを取得 (profile テーブルと結合)
    const { data, error } = await supabase
      .from("replies")
      .select(
        `
        *,
        profile: profile (
          id,
          name,
          icon
        )
      `
      )
      .eq("post_id", targetPostId)
      .order("created_at", { ascending: false }); // 新しい順

    // 3. エラーハンドリング
    if (error) {
      console.error("Replies Fetch Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 4. 成功レスポンス
    return NextResponse.json(data || []); // データがない場合は空配列を返す
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
