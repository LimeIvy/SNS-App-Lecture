import React from "react";
import { ArrowLeft } from "lucide-react";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import Link from "next/link";
import Post from "@/components/Post";
import { myPosts } from "@/data/posts";
import { myProfile } from "@/data/profile";

const Profile = () => {
  return (
    <div className="flex justify-center bg-black">
      <div className="w-full max-w-7xl flex">
        {/* レフトサイドバー */}
        <div className="w-1/5 xl:w-[275px]">
          <LeftSidebar />
        </div>

        {/* メインコンテンツ */}
        <div className="w-3/5 xl:w-[600px] min-h-screen border-x border-gray-800">
          {/* プロフィールヘッダー */}
          <div className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md z-10 p-2 border-b border-gray-800 flex items-center">
            {/* 戻るボタン */}
            <Link href="/" className="mr-4">
              <ArrowLeft className="text-white" />
            </Link>

            <div>
              <p className="text-xl font-bold text-white">{myProfile.name}</p>
              <p className="text-sm text-gray-500">
                {myPosts.length}件のポスト
              </p>
            </div>
          </div>

          {/* プロフィールカバー画像 */}
          <div className="relative h-48 bg-gray-800">
            {/* プロフィール画像 */}
            <div className="absolute -bottom-12 sm:-bottom-16 left-4 rounded-full overflow-hidden">
              <div className="mr-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-600"></div>
              </div>
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="pt-20 px-4 pb-4 border-b border-gray-800">
            {/* プロフィール編集ボタン */}
            <div className="flex justify-end mt-2 mb-4">
              <button className="border border-gray-500 text-white px-4 py-1.5 rounded-full font-bold">
                プロフィールを編集
              </button>
            </div>

            <div>
              <p className="text-white text-xl font-bold">{myProfile.name}</p>
              <p className="text-gray-500 text-sm">@{myProfile.userId}</p>
              <p className="mt-3 text-white">{myProfile.bio}</p>

              {/* 登録日 */}
              <p className="text-gray-500 mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
            <button className="flex-1 py-4 text-white font-bold border-b-4 border-blue-500">
              ポスト
            </button>
            <button className="flex-1 py-4 text-gray-500">返信</button>
            <button className="flex-1 py-4 text-gray-500">メディア</button>
            <button className="flex-1 py-4 text-gray-500">いいね</button>
          </div>

          {/* ポスト一覧 */}
          <Post posts={myPosts} />
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
