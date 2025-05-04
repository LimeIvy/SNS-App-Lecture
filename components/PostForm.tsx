"use client"; // クライアントコンポーネント化

import React, { useState, useEffect } from "react"; // useEffect をインポート
import { createClient } from "@/utils/supabase/client"; // Supabaseクライアントをインポート
import Image from "next/image"; // Image をインポート

export const PostForm = () => {
  const [content, setContent] = useState(""); // 投稿内容を管理する state
  const [userIcon, setUserIcon] = useState<string>(""); // ユーザーアイコン用
  const supabase = createClient();

  // ログインユーザーのアイコンを取得する useEffect
  useEffect(() => {
    const fetchUserIcon = async () => {
      // 1. ユーザー情報を取得
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from("profile")
          .select("icon")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching user icon:", error.message);
        } else if (profile) {
          setUserIcon(profile.icon);
          console.log(profile.icon);
        }
      }
    };

    fetchUserIcon();
  }, [supabase]);

  const handleSubmit = async () => {
    //認証状態を確認
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("ユーザーが見つかりません");
      return;
    }

    //投稿内容が空でないか確認
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      alert("投稿内容を入力してください。");
      return;
    }

    //Supabaseに投稿データを挿入

    const { error } = await supabase
      .from("posts")
      .insert({ user_id: user.id, content: trimmedContent });

    if (error) {
      console.error("Error posting content:", error.message);
      alert(`投稿エラー: ${error.message}`);
    }

    //成功時の処理
    setContent(""); // テキストエリアをクリア
    alert("投稿しました！");
  };

  return (
    <div>
      {/* 投稿フォーム */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex">
          <div className="mr-4 flex-shrink-0">
            {/* アイコンが縮まないように */}
            {/* ログインユーザーのアイコンを表示 */}
            <div className="h-10 w-10 overflow-hidden rounded-full">
              {userIcon && (
                <Image
                  src={userIcon} // state からアイコンパスを使用
                  alt="Your icon"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
            </div>
          </div>
          {/* 入力フォーム */}
          <div className="mt-1.5 flex-1">
            <textarea
              placeholder="いまどうしてる？"
              className="w-full resize-none bg-transparent text-xl text-white outline-none"
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)} // 入力内容を反映
            />
            <div className="mt-2 flex justify-end">
              <button
                className="cursor-pointer rounded-full bg-white px-4 py-1.5 font-bold text-black disabled:opacity-50"
                onClick={handleSubmit} // 送信処理を呼び出し
                disabled={!content.trim()} // 内容が空ならボタンを無効化
              >
                ポストする
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
