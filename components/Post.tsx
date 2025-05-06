"use client";

import { Heart, MessageCircle, Repeat } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { PostWithProfile } from "@/types";

// PostProps型：投稿の配列（PostWithProfile型）を受け取る
type PostProps = {
  posts: PostWithProfile[];
};

// 日付を「○秒前」「○時間前」などの形式に変換する関数
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}日前`;
};

// 投稿コンポーネントの定義
const Post = ({ posts }: PostProps) => {
  return (
    <div>
      {/* 投稿一覧をループ表示 */}
      {posts.map((post) => (
        // --- 各投稿の外側を div に変更し、キーとスタイルを適用 ---
        <div
          key={post.id}
          className="hover:bg-opacity-30 flex border-b border-gray-800 p-4 hover:bg-[#060606]"
        >
          {/* --- プロフィールアイコン部分 --- */}
          <Link
            href={`/${post.profile?.id}`}
            className="mr-4 flex-shrink-0"
          >
            <div className="h-10 w-10 rounded-full">
              {post.profile?.icon ? (
                <Image
                  src={post.profile.icon}
                  alt={post.profile.name || "user icon"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-700"></div>
              )}
            </div>
          </Link>

          {/* --- 右側のコンテンツエリア --- */}
          <Link
            href={`/${post.user_id}/${post.id}`}
            className="block w-full cursor-pointer"
          >
            <div className="w-full">
              <div className="flex items-center">
                {/* ユーザー名 */}
                <span className="mr-5 font-bold text-white">
                  {post.profile?.name || "Unknown User"}
                </span>
                {/* ユーザーIDと投稿時間 */}
                <span className="text-gray-500">
                  {formatTimeAgo(post.created_at) || ""}
                </span>
              </div>

              {/* 投稿内容 */}
              <p className="mt-1 text-white">{post.content}</p>
              {/* アクションボタン */}
              <div className="mt-3 flex w-full max-w-sm items-center gap-4 text-gray-500 sm:gap-12">
                {/* コメントボタン (イベント伝播停止) */}
                <button
                  className="flex items-center hover:text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // ボタンクリックはページ遷移させない
                    console.log("Comment clicked", post.id);
                  }}
                >
                  <MessageCircle size={18} />
                </button>
                {/* リツイートボタン (イベント伝播停止) */}
                <button
                  className="flex items-center hover:text-green-500"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Retweet clicked", post.id);
                  }}
                >
                  <Repeat size={18} />
                </button>
                {/* いいねボタン (イベント伝播停止) */}
                <button
                  className="flex items-center hover:text-pink-500"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Like clicked", post.id);
                  }}
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Post;
