import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ isFollowing: false });
  }

  const targetUserId = params.userId;

  if (user.id === targetUserId) {
    return NextResponse.json({ isFollowing: false });
  }

  try {
    const { data, error } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Follow Status Check Error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const isFollowing = data !== null;
    return NextResponse.json({ isFollowing });
  } catch (err) {
    console.error("API Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
