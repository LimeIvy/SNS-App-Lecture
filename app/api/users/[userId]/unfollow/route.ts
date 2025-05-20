import { createClient } from "@/utils/supabase/server";
import { Hono, Context } from "hono";
import { NextRequest } from "next/server";

const app = new Hono();

app.delete(async (c: Context) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const targetUserId = c.req.param("userId");

  if (user.id === targetUserId) {
    return c.json({ message: "Cannot unfollow yourself" }, 400);
  }

  try {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);

    if (error) {
      console.error("Unfollow Error:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }

    return c.newResponse(null, 204);
  } catch (err) {
    console.error("API Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export async function DELETE(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  return app.fetch(request, context);
}
