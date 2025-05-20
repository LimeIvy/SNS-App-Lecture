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
    // ログインしていない場合は401を返す
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. アンフォロー対象のユーザーIDを取得
  const targetUserId = params.userId;

  // 3. 自分自身をアンフォローしようとしていないか確認
  if (user.id === targetUserId) {
    return new NextResponse("Cannot unfollow yourself", { status: 400 });
  }

  try {
    // 4. follows テーブルから該当レコードを削除
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);

    // 5. エラーハンドリング
    if (error) {
      console.error("Unfollow Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 6. 削除成功時は204を返す（内容なし）
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
