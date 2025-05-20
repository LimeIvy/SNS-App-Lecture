import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const targetUserId = params.userId;

  if (user.id === targetUserId) {
    return new NextResponse("Cannot follow yourself", { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: targetUserId });

    if (error) {
      console.error("Follow Error:", error);
      if (error.code === "23505") {
        return new NextResponse("Already following", { status: 409 });
      }
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return new NextResponse("Followed successfully", { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
