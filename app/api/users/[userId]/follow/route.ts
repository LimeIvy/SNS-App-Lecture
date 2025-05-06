import { createClient } from "@/utils/supabase/server"; // サーバー用クライアント
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = await createClient(); // await を追加

  // 1. 認証状態の確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. フォロー対象のユーザーIDを取得
  const targetUserId = params.userId;

  // 3. 自分自身をフォローしようとしていないか確認 (任意だが推奨)
  if (user.id === targetUserId) {
    return new NextResponse("Cannot follow yourself", { status: 400 });
  }

  try {
    // 4. follows テーブルにレコードを挿入
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: targetUserId });

    // 5. エラーハンドリング (ユニーク制約違反なども考慮)
    if (error) {
      console.error("Follow Error:", error);
      // すでにフォロー済みの場合 (ユニーク制約違反)
      if (error.code === "23505") {
        // PostgreSQL unique_violation error code
        return new NextResponse("Already following", { status: 409 }); // Conflict
      }
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 6. 成功レスポンス
    return new NextResponse("Followed successfully", { status: 201 }); // Created
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
