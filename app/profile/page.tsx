import React from "react";
import { MoveLeft } from "lucide-react";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import Link from "next/link";
import Image from "next/image";
import Post from "@/components/Post";
import { myPosts } from "@/data/posts";
import { myProfile } from "@/data/profile";

const profile = () => {
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="ml-64  mr-64 w-full min-h-screen bg-black border-1 border-gray-800">
        {/* プロフィールヘッダー */}
        <div className="fixed left-64 right-64 flex items-center gap-4 text-white p-2 z-10 bg-black">
          {/* 戻るボタン */}
          <Link href="/">
            <MoveLeft
              className="ml-4 cursor-pointer"
              size={20}
              strokeWidth={3}
            />
          </Link>

          <div>
            <p className="text-xl font-bold">{myProfile.name}</p>
            <p className="text-sm text-gray-400">7件のポスト</p>
          </div>
        </div>
        {/* プロフィール画像 */}
        <div className="relative border-1 border-gray-800 h-40 bg-gray-800">
          <Image
            src={myProfile.image}
            alt="プロフィール画像"
            className="object-cover absolute bottom-[-40%] left-[10%]"
            width={130}
            height={130}
          />
        </div>
        {/* プロフィール情報 */}
        <div className="relative border-b border-gray-800">
          <div className="absolute top-[-30%] right-[5%]">
            <button className="bg-black text-white px-2 py-1 border-1 rounded-full border-gray-800">
              プロフィールを編集
            </button>
          </div>
          <div className="flex flex-col p-4 mt-15">
            <p className="text-white text-xl font-bold">{myProfile.name}</p>
            <p className="text-gray-400 text-sm">@{myProfile.userId}</p>
            <p className="mt-2 text-white text-md">{myProfile.bio}</p>
            <div className="mt-3 flex items-center gap-2 text-gray-400 text-sm">
              <p className="text-white">{myProfile.following}</p>
              <p className="">フォロー中</p>
              <p className="text-white">{myProfile.followers}</p>
              <p className="">フォロワー</p>
            </div>
          </div>
        </div>
        {/* ポスト */}
        <Post posts={myPosts} />
      </div>
      <RightSidebar />
    </div>
  );
};
export default profile;
