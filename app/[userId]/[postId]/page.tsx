"use client";
import { use } from "react";
import { ArrowLeft, Heart, MessageCircle, Repeat } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { posts } from "@/data/posts";
import { ReplyForm } from "@/components/ReplyForm";

export default function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params); // use()でPromiseを解決する！

  // 投稿データを検索
  const post = posts.find((p) => p.id === postId);

  // 投稿が見つからない場合は404
  if (!post) {
    notFound();
  }

  // 返信データ（現在はダミーデータ）
  const replies = posts.filter((p) => p.id !== postId).slice(0, 3);

  // 投稿日時をフォーマット（実際のアプリではより詳細な処理が必要）
  const formattedDate = "午前8:00·2025年4月26日";

  return (
    <div className="flex justify-center bg-black">
      {/* コンテンツラッパー - 大画面ではコンテンツを中央に配置 */}
      <div className="w-full max-w-7xl flex">
        {/* レフトサイドバー */}
        <div className="w-1/5 xl:w-[275px]">
          <LeftSidebar />
        </div>

        {/* メインコンテンツ */}
        <div className="w-3/5 xl:w-[600px] min-h-screen border-x border-gray-800">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md z-10 p-4 border-b border-gray-800 flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="text-white" />
            </Link>
            <h1 className="text-xl font-bold text-white">ポスト</h1>
          </div>

          {/* 投稿詳細 */}
          <div className="border-b border-gray-800 p-4">
            {/* 投稿者情報 */}
            <div className="flex items-start mb-3">
              <div className="mr-3">
                <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden"></div>
              </div>
              <div>
                <p className="font-bold text-white">{post.username}</p>
                <p className="text-gray-500">@{post.userId}</p>
              </div>
            </div>

            {/* 投稿内容 */}
            <div className="mb-4">
              <p className="text-white text-xl whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              {/* 投稿時間 */}
              <p className="text-gray-500 mt-4 pb-4 border-b border-gray-800">
                {formattedDate}
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-12 items-center mt-3 text-gray-500 w-full max-w-sm">
              {/* リプライ */}
              <button
                className="flex items-center hover:text-blue-500"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={18} />
                <span className="ml-1 text-xs">{post.comments}</span>
              </button>
              {/* リツイート */}
              <button
                className="flex items-center hover:text-green-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Repeat size={18} />
                <span className="ml-1 text-xs">{post.retweets}</span>
              </button>
              {/* いいね */}
              <button
                className="flex items-center hover:text-pink-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart size={18} />
                <span className="ml-1 text-xs">{post.likes}</span>
              </button>
            </div>
          </div>

          {/* 返信入力フォーム */}
          <ReplyForm postId={postId} userId={post.userId} />

          {/* 返信一覧 */}
          <div>
            <h2 className="font-bold text-white text-xl p-4">返信</h2>
            {replies.map((reply) => (
              <div key={reply.id} className="border-b border-gray-800 p-4">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-bold text-white mr-1">
                        {reply.username}
                      </span>
                      <span className="text-gray-500">
                        @{reply.userId}・{reply.time}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      返信先: @{post.userId}
                    </span>
                    <p className="text-white mt-1">{reply.content}</p>
                    <div className="flex gap-12 items-center mt-3 text-gray-500 w-full max-w-sm">
                      <button className="flex items-center hover:text-blue-500">
                        <MessageCircle size={18} />
                        <span className="ml-1 text-xs">{reply.comments}</span>
                      </button>
                      <button className="flex items-center hover:text-green-500">
                        <Repeat size={18} />
                        <span className="ml-1 text-xs">{reply.retweets}</span>
                      </button>
                      <button className="flex items-center hover:text-pink-500">
                        <Heart size={18} />
                        <span className="ml-1 text-xs">{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ライトサイドバー */}
        <div className="w-1/5 xl:w-[350px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
