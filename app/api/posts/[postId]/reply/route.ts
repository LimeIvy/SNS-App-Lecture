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

  const targetPostId = c.req.param("postId");

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    console.error("Request body parsing error:", error);
    return c.json({ message: "Invalid request body" }, 400);
  }

  const content = requestBody.content;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return c.json(
      { message: "Content is required and must be a non-empty string" },
      400
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
        return c.json({ message: "Invalid post_id or user_id" }, 400);
      }
      return c.json({ message: "Internal Server Error" }, 500);
    }

    return c.json(data, 201);
  } catch (err) {
    console.error("API Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export async function POST(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  return app.fetch(request, context);
}
