import { createClient } from "@/utils/supabase/server";
import { Hono, Context } from "hono";
import { NextRequest } from "next/server";

const app = new Hono();

app.post(async (c: Context) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const targetUserId = c.req.param("userId");

  if (user.id === targetUserId) {
    return c.json({ message: "Cannot follow yourself" }, 400);
  }

  try {
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: targetUserId });

    if (error) {
      console.error("Follow Error:", error);
      if (error.code === "23505") {
        return c.json({ message: "Already following" }, 409);
      }
      return c.json({ message: "Internal Server Error" }, 500);
    }

    return c.json({ message: "Followed successfully" }, 201);
  } catch (err) {
    console.error("API Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export async function POST(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  return app.fetch(request, context);
}
