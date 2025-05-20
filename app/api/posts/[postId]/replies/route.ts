import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { postId: string } }
) {
  const supabase = await createClient();

  const { postId: targetPostId } = context.params;

  if (!targetPostId) {
    return new NextResponse("Post ID is required", { status: 400 });
  }

  try {
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Replies Fetch Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
