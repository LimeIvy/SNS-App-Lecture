import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const targetPostId = params.postId;

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
      {
        status: 400,
      }
    );
  }

  try {
    const { data, error } = await supabase
      .from("replies")
      .insert({
        user_id: user.id,
        post_id: targetPostId,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Reply Creation Error:", error);
      if (error.code === "23503") {
        return new NextResponse("Invalid post_id or user_id", { status: 400 });
      }
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
