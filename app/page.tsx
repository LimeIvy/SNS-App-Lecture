import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { PostForm } from "@/components/PostForm";
import Post from "@/components/Post";
import { posts } from "@/data/posts";

export default function home() {
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
          <div className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md z-10 p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">ホーム</h1>
          </div>

          {/* 投稿フォーム */}
          <PostForm />

          {/* 投稿一覧 */}
          <Post posts={posts} />
        </div>

        {/* ライトサイドバー */}
        <div className="w-1/5 xl:w-[350px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
