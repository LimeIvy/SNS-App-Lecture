"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"; // ページリフレッシュ用
import { X } from "lucide-react";

// Props の型定義
interface EditProfileModalProps {
  closeModal: () => void; // モーダルを閉じる関数
  // 現在のプロフィール情報
  userId: string;
  userName: string;
  userIntroduction: string;
  userIcon: string;
}

export default function EditProfileModal({
  closeModal,
  userId,
  userName,
  userIntroduction,
  userIcon,
}: EditProfileModalProps) {
  const supabase = createClient();
  const router = useRouter(); // ページリフレッシュのために router を取得

  // フォームの状態管理
  const [name, setName] = useState(userName || "");
  const [introduction, setIntroduction] = useState(userIntroduction || "");
  const [icon, setIcon] = useState<string | null>(null); // 編集対象のユーザーアイコン
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // モーダル表示時に背景スクロールを禁止する
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // profile prop が変更されたら state を更新 (もし必要なら)
  useEffect(() => {
    setName(userName || "");
    setIntroduction(userIntroduction || "");
    setIcon(userIcon || "");
  }, [supabase, userName, userIntroduction, userIcon]);

  // 更新処理
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルト送信を防止
    setIsUpdating(true);
    setError(null);

    if (!userId) {
      setError("ユーザーIDが見つかりません。");
      setIsUpdating(false);
      return;
    }

    // Supabase の profile テーブルを更新
    const { error: updateError } = await supabase
      .from("profile")
      .update({
        name: name.trim(), // 前後の空白を削除
        introduction: introduction,
        icon: icon,
      })
      .eq("id", userId); // 対象ユーザーのIDで更新

    if (updateError) {
      console.error("Error updating profile:", updateError.message);
      setError(`プロフィールの更新に失敗しました: ${updateError.message}`);
    } else {
      // 更新成功時の処理
      alert("プロフィールを更新しました！");
      closeModal(); // モーダルを閉じる
      router.refresh(); // ページをリフレッシュして最新のプロフィールを表示
    }

    setIsUpdating(false);
  };

  return (
    // モーダルの背景 (オーバーレイ)
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
      {/* モーダルのコンテンツ */}
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-black p-6 shadow-xl">
        {/* エラーメッセージ表示 */}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form onSubmit={handleUpdate}>
          <div className="mb-4 flex items-center justify-between gap-8">
            <div className="flex items-center">
              <button
                type="button" // type="button" でフォーム送信を防ぐ
                onClick={closeModal}
                className="rounded-full p-2 text-white hover:bg-gray-900"
                disabled={isUpdating}
              >
                <X />
              </button>
              <h2 className="text-xl font-bold text-white">
                プロフィールを編集
              </h2>
            </div>

            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-200 disabled:opacity-50"
              disabled={isUpdating || !name.trim()} // ローディング中または名前が空なら無効
            >
              {isUpdating ? "保存中..." : "保存"}
            </button>
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-400"
            >
              名前
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-black p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              maxLength={50} // 最大50文字
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="introduction"
              className="mb-1 block text-sm font-medium text-gray-400"
            >
              自己紹介
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-800 bg-black p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              maxLength={160} // 最大160文字
            />
          </div>
        </form>
      </div>
    </div>
  );
}
