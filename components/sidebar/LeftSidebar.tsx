"use client";

import { Bell, Home, MoreHorizontal, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  icon: string | null;
}

export const LeftSidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
      }
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata.name);
        setUserIcon(user.user_metadata.icon);
      } else {
        console.log("ユーザーが見つかりません");
      }
    };
    getSession();
  }, [supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      alert(`ログアウトエラー: ${error.message}`);
    } else {
      console.log("Logged out successfully");
      alert("ログアウトしました。");
      // ログインページへリダイレクトし、キャッシュをクリアしてサーバー側の状態も更新
      setUserName(null);
      setUserIcon(null);
      router.push("/login");
      router.refresh();
    }
  };

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
    <div className="sticky top-0 h-screen text-white">
      <div className="flex h-full w-full flex-col justify-between border-r border-gray-800 bg-black">
        <div className="flex flex-col gap-2">
          {/* ロゴ */}
          <Link href="/" className="h-12 w-full p-4">
            <Image src="/X.png" alt="logo" width={40} height={40} />
          </Link>
          {/* ホーム */}
          <Link href="/" className="mt-10 flex rounded-full px-2">
            <div className="flex items-center rounded-full px-4 py-3 hover:bg-gray-900">
              <Home />
              <p className="ml-3 hidden lg:block">ホーム</p>
            </div>
          </Link>
          {/* 話題を検索 */}
          <Link href="/explore" className="flex rounded-full px-2">
            <div className="flex items-center rounded-full px-4 py-3 hover:bg-gray-900">
              <Search />
              <p className="ml-3 hidden lg:block">話題を検索</p>
            </div>
          </Link>
          {/* 通知 */}
          <Link href="/notifications" className="flex rounded-full px-2">
            <div className="flex items-center rounded-full px-4 py-3 hover:bg-gray-900">
              <Bell />
              <p className="ml-3 hidden lg:block">通知</p>
            </div>
          </Link>
          {/* プロフィール */}
          <Link href={`/${userId}`} className="flex rounded-full px-2">
            <div className="flex items-center rounded-full px-4 py-3 hover:bg-gray-900">
              <User />
              <p className="ml-3 hidden lg:block">プロフィール</p>
            </div>
          </Link>
        </div>
        {/* アカウント */}
        <div className="relative mb-3 px-3">
          <button
            ref={buttonRef}
            className="flex w-full items-center justify-between rounded-full p-3 hover:bg-gray-800"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <div className="h-8 w-8 rounded-full bg-gray-600">
                  <Image
                    src={userIcon || "/default-icon.png"}
                    alt="user icon"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-bold">{userName}</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="hidden text-white lg:block" />
          </button>

          {/* アカウントメニュー */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute bottom-full left-3 z-50 mb-2 w-60 overflow-hidden rounded-xl border border-gray-800 bg-black shadow-lg hover:bg-gray-900"
            >
              <button
                className="cursor-pointer p-4 text-white"
                onClick={handleLogout}
              >
                {userName}からログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
