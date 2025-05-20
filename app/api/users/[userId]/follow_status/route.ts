import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: routeParamsFromContext }: { params: { userId: string } }
) {
  const supabase = await createClient();

  // 1. 認証状態の確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 認証されていない場合はフォローしているはずがない
    return NextResponse.json({ isFollowing: false });
  }

  const params = await routeParamsFromContext;

  // 2. フォロー状態を確認したい対象のユーザーIDを取得
  const targetUserId = params.userId;

  // 3. 自分自身のフォロー状態は常に false とする (フォローできないため)
  if (user.id === targetUserId) {
    return NextResponse.json({ isFollowing: false });
  }

  try {
    // 4. follows テーブルでフォロー関係が存在するか確認
    const { data, error } = await supabase
      .from("follows")
      .select("id") // 存在確認のため、id のみ取得
      .eq("follower_id", user.id) // ログインユーザーID
      .eq("following_id", targetUserId) // 対象ユーザーID
      .limit(1) // 1件見つかれば十分
      .maybeSingle(); // 結果が存在すればオブジェクト、なければ null を返す

    // 5. エラーハンドリング
    if (error) {
      console.error("Follow Status Check Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 6. 結果に基づいてフォロー状態を返す
    const isFollowing = data !== null; // data が null でなければフォロー中
    return NextResponse.json({ isFollowing });
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
