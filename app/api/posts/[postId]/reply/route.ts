import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = await createClient();

  // 1. 認証状態の確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. 返信対象の投稿IDを取得
  const targetPostId = params.postId;

  // 3. リクエストボディから返信内容を取得
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    console.error("Request body parsing error:", error);
    return new NextResponse("Invalid request body", { status: 400 });
  }

  const content = requestBody.content;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return new NextResponse(
      "Content is required and must be a non-empty string",
      { status: 400 }
    );
  }

  try {
    // 4. replies テーブルにレコードを挿入
    const { data, error } = await supabase
      .from("replies")
      .insert({
        user_id: user.id,
        post_id: targetPostId,
        content: content.trim(), // 前後の空白を除去
      })
      .select() // 挿入したデータを返す (任意)
      .single();

    // 5. エラーハンドリング
    if (error) {
      console.error("Reply Creation Error:", error);
      // 外部キー制約違反 (存在しない投稿への返信など) を考慮
      if (error.code === "23503") {
        // foreign_key_violation
        return new NextResponse("Invalid post_id or user_id", { status: 400 });
      }
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 6. 成功レスポンス (作成されたリソースを返すのが一般的)
    return NextResponse.json(data, { status: 201 }); // Created
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
