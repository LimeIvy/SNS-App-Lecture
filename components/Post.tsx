"use client";

import { Heart, MessageCircle, Repeat } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PostData } from "@/data/posts";

type PostProps = {
  posts: PostData[];
};

const Post = ({ posts }: PostProps) => {
  // 投稿の状態を管理するステート
  const [postsState, setPostsState] = useState<PostData[]>(posts);

  // props の posts が変更されたときにステートを更新
  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  // いいねの処理
  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setPostsState((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      )
    );
  };

  // リツイート/リポストの処理
  const handleRetweet = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setPostsState((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, retweets: post.retweets + 1, isRetweeted: true }
          : post
      )
    );
  };

  // コメント/リプライの処理
  const handleComment = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // ここに実際のコメント機能を実装することができます
    console.log(`コメントボタンがクリックされました: ${postId}`);
  };

  return (
    <div>
      {postsState.map((post) => (
        <Link
          key={post.id}
          href={`/${post.userId}/${post.id}`}
          className="block border-b border-gray-800 cursor-pointer hover:bg-[#060606] hover:bg-opacity-30"
        >
          <div className="p-4">
            <div className="flex">
              <div className="mr-4">
                <div className="w-10 h-10 rounded-full bg-gray-600"></div>
              </div>
              <div>
                <div className="flex items-center">
                  {/* ユーザー名 */}
                  <span className="font-bold text-white mr-1">
                    {post.username}
                  </span>
                  {/* ユーザーID・投稿時間 */}
                  <span className="text-gray-500">
                    @{post.userId}・{post.time}
                  </span>
                </div>
                {/* 投稿内容 */}
                <p className="text-white mt-1">{post.content}</p>
                <div className="flex gap-4 sm:gap-12 items-center mt-3 text-gray-500 w-full max-w-sm">
                  {/* リプライ */}
                  <button
                    className="flex items-center hover:text-blue-500"
                    onClick={(e) => handleComment(e, post.id)}
                  >
                    <MessageCircle size={18} />
                    <span className="ml-1 text-xs">{post.comments}</span>
                  </button>
                  {/* リツイート */}
                  <button
                    className={`flex items-center hover:text-green-500 ${
                      post.isRetweeted ? "text-green-500" : ""
                    }`}
                    onClick={(e) => handleRetweet(e, post.id)}
                  >
                    <Repeat size={18} />
                    <span className="ml-1 text-xs">{post.retweets}</span>
                  </button>
                  {/* いいね */}
                  <button
                    className={`flex items-center hover:text-pink-500 ${
                      post.isLiked ? "text-pink-500" : ""
                    }`}
                    onClick={(e) => handleLike(e, post.id)}
                  >
                    <Heart
                      size={18}
                      className={post.isLiked ? "fill-pink-500" : ""}
                    />
                    <span className="ml-1 text-xs">{post.likes}</span>
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
