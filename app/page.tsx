import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { PostForm } from "@/components/PostForm";
import Post from "@/components/Post";
import { posts } from "@/data/posts";

export default function home() {
  return (
    <div className="flex">
      {/* レフトサイドバー */}
      <LeftSidebar />

      {/* メインコンテンツ */}
      <div className="ml-64  mr-64 w-full min-h-screen bg-black border-1 border-gray-800">
        {/* 投稿フォーム */}
        <PostForm />

        {/* 投稿一覧 */}
        <Post posts={posts} />
      </div>

      {/* ライトサイドバー */}
      <RightSidebar />
    </div>
  );
}
