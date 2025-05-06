import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = await createClient();

  // 1. 認証状態の確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. アンフォロー対象のユーザーIDを取得
  const targetUserId = params.userId;

  // 3. 自分自身をアンフォローしようとしていないか確認 (任意だが推奨)
  if (user.id === targetUserId) {
    return new NextResponse("Cannot unfollow yourself", { status: 400 });
  }

  try {
    // 4. follows テーブルからレコードを削除
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id) // 自分のID
      .eq("following_id", targetUserId); // アンフォロー対象のID

    // 5. エラーハンドリング
    if (error) {
      console.error("Unfollow Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 6. 成功レスポンス (削除成功時は 204 No Content が一般的)
    // Note: 削除対象が存在しなくてもエラーにはならない場合が多い
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
