import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const postId = segments[segments.indexOf("posts") + 1];

  if (!postId) {
    return new NextResponse("Post ID is required", { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("replies")
      .select(
        `
        *,
        profile:profile (
          id,
          name,
          icon
        )
      `
      )
      .eq("post_id", postId)
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
