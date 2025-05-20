import { createClient } from "@/utils/supabase/server";
import { Hono, Context } from "hono";
import { NextRequest } from "next/server";

const app = new Hono();

app.get(async (c: Context) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ isFollowing: false });
  }

  const targetUserId = c.req.param("userId");

  if (user.id === targetUserId) {
    return c.json({ isFollowing: false });
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
      return c.json({ message: "Internal Server Error" }, 500);
    }

    const isFollowing = data !== null;
    return c.json({ isFollowing });
  } catch (err) {
    console.error("API Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  return app.fetch(request, context);
}
