"use client";
import { Bell, Home, MoreHorizontal, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { myProfile } from "@/data/profile";

export const LeftSidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 外側クリック検出のための関数
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    // イベントリスナーの登録
    document.addEventListener("mousedown", handleOutsideClick);

    // クリーンアップ関数
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen text-white">
      <div className="bg-black h-full w-64 flex flex-col justify-between border-r-1 border-gray-600">
        <div className="flex flex-col gap-2 text-xl">
          <Link href="/" className="w-full h-12 m-4">
            <Image src="/X.png" alt="logo" width={48} height={48} />
          </Link>
          {/* ホーム */}
          <Link href="/" className="px-2 flex rounded-full">
            <div className="flex items-center hover:bg-gray-900 rounded-full px-6 py-3">
              <Home />
              <p className="ml-3">ホーム</p>
            </div>
          </Link>
          {/* 話題を検索 */}
          <Link href="/explore" className="px-2 flex rounded-full">
            <div className="flex items-center hover:bg-gray-900 rounded-full px-6 py-3">
              <Search />
              <p className="ml-3">話題を検索</p>
            </div>
          </Link>
          {/* 通知 */}
          <Link href="/notifications" className="px-2 flex rounded-full">
            <div className="flex items-center hover:bg-gray-900 rounded-full px-6 py-3">
              <Bell />
              <p className="ml-3">通知</p>
            </div>
          </Link>
          {/* プロフィール */}
          <Link href="/profile" className="px-2 flex rounded-full">
            <div className="flex items-center hover:bg-gray-900 rounded-full px-6 py-3">
              <User />
              <p className="ml-3">プロフィール</p>
            </div>
          </Link>
        </div>
        {/* アカウント */}
        <div className="px-3 mb-3 relative">
          <button
            ref={buttonRef}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded-full"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 overflow-hidden">
                <Image
                  src={myProfile.image}
                  alt="プロフィール画像"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{myProfile.name}</p>
                <p className="text-gray-500 text-sm">@{myProfile.userId}</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-white" />
          </button>

          {/* アカウントメニュー */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute bottom-full left-3 mb-2 w-60 bg-black rounded-xl shadow-lg border border-gray-800 overflow-hidden z-50 hover:bg-gray-900"
            >
              <button className="px-4 py-2 cursor-pointer text-white">
                @{myProfile.userId}からログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
