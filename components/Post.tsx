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
        // 投稿詳細ページへのリンク（クリックでページ遷移）
        <Link
          key={post.id}
          href={`/${post.user_id}/${post.id}`}
          className="hover:bg-opacity-30 block cursor-pointer border-b border-gray-800 hover:bg-[#060606]"
        >
          <div className="p-4">
            <div className="flex">
              {/* プロフィールアイコン表示領域 */}
              <div className="mr-4 flex-shrink-0">
                <div className="h-10 w-10 rounded-full">
                  {post.profile?.icon ? (
                    // プロフィール画像が存在する場合
                    <Image
                      src={post.profile.icon}
                      alt={post.profile.name || "user icon"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    // プロフィール画像がない場合はデフォルトの丸背景
                    <div className="h-full w-full rounded-full bg-gray-700"></div>
                  )}
                </div>
              </div>

              {/* 投稿の本文とユーザー情報 */}
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
                <div className="mt-3 flex w-full max-w-sm items-center gap-4 text-gray-500 sm:gap-12">
                  {/* コメント */}
                  <button
                    className="flex items-center hover:text-blue-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Comment clicked", post.id);
                    }}
                  >
                    <MessageCircle size={18} />
                  </button>

                  {/* リツイート */}
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

                  {/* いいね */}
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
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Post;
