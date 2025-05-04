"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import Link from "next/link";
import Post from "@/components/Post";
import { myPosts } from "@/data/posts";
import { myProfile } from "@/data/profile";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PostWithProfile } from "@/types";

const Profile = () => {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userIntroduction, setUserIntroduction] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostWithProfile[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
      }
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata.name);
        setUserIntroduction(user.user_metadata.introduction);
        setUserIcon(user.user_metadata.icon);
      } else {
        console.log("ユーザーが見つかりません");
      }
    };
    getSession();
  }, [supabase]);

  // 投稿一覧を取得
  useEffect(() => {
    const fetchPosts = async () => {
      // ユーザーが見つからない場合は空の配列
      if (!userId) {
        setPosts([]);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*, profile: profile(*)") // 外部キーで結合してプロフィール情報も取得
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("投稿の取得エラー:", error.message);
        setPosts([]);
        return;
      }

      if (data) {
        setPosts(data as PostWithProfile[]);
      } else {
        setPosts([]);
      }
    };

    fetchPosts();
  }, [supabase, userId]);

  return (
    <div className="flex justify-center bg-black">
      <div className="flex w-full max-w-7xl">
        {/* レフトサイドバー */}
        <div className="w-1/5 xl:w-[275px]">
          <LeftSidebar />
        </div>

        {/* メインコンテンツ */}
        <div className="min-h-screen w-3/5 border-x border-gray-800 xl:w-[600px]">
          {/* プロフィールヘッダー */}
          <div className="bg-opacity-80 sticky top-0 z-10 flex items-center border-b border-gray-800 bg-black p-2 backdrop-blur-md">
            {/* 戻るボタン */}
            <Link href="/" className="mr-4">
              <ArrowLeft className="text-white" />
            </Link>

            <div>
              <p className="text-xl font-bold text-white">{userName}</p>
              <p className="text-sm text-gray-500">
                {myPosts.length}件のポスト
              </p>
            </div>
          </div>

          {/* プロフィールカバー画像 */}
          <div className="relative h-48 bg-gray-800">
            {/* プロフィール画像 */}
            <div className="absolute -bottom-12 left-4 overflow-hidden rounded-full sm:-bottom-16">
              <div className="mr-4">
                <div className="h-24 w-24 rounded-full bg-gray-600 sm:h-32 sm:w-32">
                  <Image
                    src={userIcon || "/default-icon.png"}
                    alt="user icon"
                    width={128}
                    height={128}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="border-b border-gray-800 px-4 pt-20 pb-4">
            {/* プロフィール編集ボタン */}
            <div className="mt-2 mb-4 flex justify-end">
              <button className="rounded-full border border-gray-500 px-4 py-1.5 font-bold text-white">
                プロフィールを編集
              </button>
            </div>

            <div>
              <p className="text-xl font-bold text-white">{userName}</p>
              <p className="mt-3 text-white">{userIntroduction}</p>

              {/* 登録日 */}
              <p className="mt-2 flex items-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                2025年4月から参加
              </p>

              {/* フォロー・フォロワー */}
              <div className="mt-3 flex items-center space-x-4 text-gray-300">
                <p>
                  <span className="font-bold text-white">
                    {myProfile.following}
                  </span>{" "}
                  <span className="text-gray-500">フォロー中</span>
                </p>
                <p>
                  <span className="font-bold text-white">
                    {myProfile.followers}
                  </span>{" "}
                  <span className="text-gray-500">フォロワー</span>
                </p>
              </div>
            </div>
          </div>

          {/* タブメニュー */}
          <div className="flex border-b border-gray-800">
            <button className="flex-1 border-b-4 border-blue-500 py-4 font-bold text-white">
              ポスト
            </button>
            <button className="flex-1 py-4 text-gray-500">返信</button>
            <button className="flex-1 py-4 text-gray-500">メディア</button>
            <button className="flex-1 py-4 text-gray-500">いいね</button>
          </div>

          {/* ポスト一覧 */}
          <Post posts={posts || []} />
        </div>

        {/* ライトサイドバー */}
        <div className="w-1/5 xl:w-[350px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Profile;
