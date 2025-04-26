import { Heart, MessageCircle, Repeat } from "lucide-react";
import React from "react";
import { PostData } from "@/data/posts";

const Post = ({ posts }: { posts: PostData[] }) => {
  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="border-b border-gray-800 p-4 cursor-pointer"
        >
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
              <div className="flex gap-12 items-center mt-3 text-gray-500 w-full max-w-sm">
                {/* リプライ */}
                <button className="flex items-center hover:text-blue-500">
                  <MessageCircle size={18} />
                  <span className="ml-1 text-xs">{post.comments}</span>
                </button>
                {/* リツイート */}
                <button className="flex items-center hover:text-green-500">
                  <Repeat size={18} />
                  <span className="ml-1 text-xs">{post.retweets}</span>
                </button>
                {/* いいね */}
                <button className="flex items-center hover:text-pink-500">
                  <Heart size={18} />
                  <span className="ml-1 text-xs">{post.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
