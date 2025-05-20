import { createClient } from "@/utils/supabase/server";
import { Hono, Context } from "hono";
import { NextRequest } from "next/server";

const app = new Hono();

app.get(async (c: Context) => {
  const supabase = await createClient();

  const postId = c.req.param("postId");

  if (!postId) {
    return c.json({ message: "Post ID is required" }, 400);
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
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Replies Fetch Error:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }

    return c.json(data || []);
  } catch (err) {
    console.error("API Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export async function GET(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  return app.fetch(request, context);
}
