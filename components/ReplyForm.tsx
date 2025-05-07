"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ReplyFormProps = {
  postId: string;
  userId: string;
  onReplySuccess?: (newReply: unknown) => void;
};

export const ReplyForm = ({
  postId,
  userId,
  onReplySuccess,
}: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("返信内容を入力してください。");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setContent("");
        alert("返信しました！");
        if (onReplySuccess) {
          onReplySuccess(newReply);
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "返信に失敗しました。" }));
        setError(errorData.message || "返信の送信中にエラーが発生しました。");
        console.error(
          "Reply submission error:",
          response.statusText,
          errorData
        );
      }
    } catch (e: unknown) {
      console.error("Reply submission fetch error:", e);
      let errorMessage =
        "予期せぬエラーが発生しました。もう一度お試しください。";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserIcon = async () => {
      const { data: userData } = await supabase
        .from("profiles")
        .select("icon")
        .eq("id", userId)
        .single();
      setUserIcon(userData?.icon || "/default-icon.png");
    };
    fetchUserIcon();
  }, [supabase, userId]);

  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex">
        <div className="mr-3">
          <div className="h-10 w-10 rounded-full">
            <Image
              src={userIcon || "/default-icon.png"}
              alt="user icon"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div className="mt-1.5 flex-1">
          <textarea
            placeholder="返信をポスト"
            className="w-full resize-none bg-transparent text-xl text-white outline-none"
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <div className="mt-2 flex justify-end">
            {isLoading ? (
              <p>返信中...</p>
            ) : (
              <button
                className="cursor-pointer rounded-full bg-white px-4 py-1.5 font-bold text-black"
                onClick={handleSubmit}
                disabled={isLoading || !content.trim()}
              >
                返信
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
