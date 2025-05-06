"use client";

import React from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import Link from "next/link";
import Post from "@/components/Post";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PostWithProfile } from "@/types";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const params = useParams<{ userId: string }>();
  const userIdParam = params.userId;
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [userIntroduction, setUserIntroduction] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState<boolean>(false);

  useEffect(() => {
    // ユーザー情報と投稿を取得する非同期関数
    const fetchData = async () => {
      // ユーザー情報を取得
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError.message);
        setPosts([]); // エラー時は投稿をクリア
        return;
      }

      if (user) {
        // URLのuserIdParamを使ってプロフィール情報を取得
        const { data: profile, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", userIdParam) // userIdParam を使用
          .single();

        if (profileError) {
          console.error("Error getting profile:", profileError.message);
          // 404 Not Found のようなエラーハンドリングが必要な場合がある
          setPosts([]);
          return; // プロフィール取得失敗時はここで終了
        }

        if (profile) {
          // プロフィール情報をステートにセット
          setUserId(profile.id);
          setUserName(profile.name);
          setUserIntroduction(profile.introduction);
          setUserIcon(profile.icon);
          const createdAtDate = new Date(profile.created_at);
          const formattedDate = `${createdAtDate.getFullYear()}年${createdAtDate.getMonth() + 1}月から利用しています`;
          setUserCreatedAt(formattedDate);
          // ログインユーザーとプロフィールページのユーザーが一致するか確認
          setIsOwner(profile.id === user.id);

          const fetchFollowData = async () => {
            // フォロー数取得
            const { count: following, error: followingError } = await supabase
              .from("follows")
              .select("id", { count: "exact", head: true })
              .eq("follower_id", profile.id);
            if (followingError)
              console.error("フォロー数の取得エラー:", followingError.message);
            else setFollowingCount(following || 0);

            // フォロワー数取得
            const { count: followers, error: followersError } = await supabase
              .from("follows")
              .select("id", { count: "exact", head: true })
              .eq("following_id", profile.id);
            if (followersError)
              console.error(
                "フォロワー数の取得エラー:",
                followersError.message
              );
            else setFollowerCount(followers || 0);

            // フォロー状態取得 (自分自身でない場合)
            if (profile.id !== user.id) {
              try {
                const response = await fetch(
                  `/api/users/${profile.id}/follow_status`
                );
                if (response.ok) {
                  const data = await response.json();
                  setIsFollowing(data.isFollowing);
                } else {
                  console.error(
                    "フォロー状態の取得に失敗しました。",
                    response.statusText
                  );
                }
              } catch (error) {
                console.error(
                  "フォロー状態の取得中にエラーが発生しました。",
                  error
                );
              }
            }
          };

          const fetchUserPosts = async () => {
            const { data: postsData, error: postsError } = await supabase
              .from("posts")
              .select("*, profile: profile(*)")
              .eq("user_id", profile.id)
              .order("created_at", { ascending: false });

            if (postsError) {
              console.error("投稿の取得エラー:", postsError.message);
              setPosts([]);
            } else {
              setPosts((postsData as PostWithProfile[]) || []);
            }
          };

          await Promise.all([fetchFollowData(), fetchUserPosts()]);
        } else {
          console.log("プロフィールが見つかりません");
          setPosts([]); // 投稿もクリア
        }
      } else {
        // ログインユーザーが見つからない場合の処理
        console.log("ユーザーが見つかりません");
        setPosts([]); // 投稿もクリア
      }
    };

    fetchData();
  }, [supabase, userIdParam]);

  // フォロー/アンフォロー処理
  const handleFollowToggle = async () => {
    if (!userId || isLoadingFollow) return; // 対象ユーザーIDがない、または処理中なら何もしない

    setIsLoadingFollow(true);
    const targetUserId = userId; // 現在表示しているプロフィールユーザーID

    try {
      if (isFollowing) {
        // --- アンフォロー API 呼び出し ---
        const response = await fetch(`/api/users/${targetUserId}/unfollow`, {
          method: "DELETE",
        });
        if (response.ok) {
          console.log("Unfollowed successfully");
          setIsFollowing(false);
          setFollowerCount((prev) => prev - 1);
        } else {
          console.error("アンフォローに失敗しました。", response.statusText);
        }
      } else {
        // --- フォロー API 呼び出し ---
        const response = await fetch(`/api/users/${targetUserId}/follow`, {
          method: "POST",
        });
        if (response.ok || response.status === 409) {
          // 409: Already following (念のため)
          console.log("Followed successfully or already following");
          setIsFollowing(true);
          // すでにフォローしていた場合(409)でもカウントは変動しないように、成功時のみインクリメント
          if (response.ok) {
            setFollowerCount((prev) => prev + 1);
          }
        } else {
          console.error("フォローに失敗しました。", response.statusText);
        }
      }
    } catch (error) {
      console.error("フォロー/アンフォロー処理中にエラー:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center bg-black">
      <div className="flex w-full max-w-7xl">
        {/* レフトサイドバー */}
        <div className="w-1/5 xl:w-[275px]">
          <LeftSidebar />
        </div>

        {/* メインコンテンツ */}
        {isModalOpen && (
          <EditProfileModal
            closeModal={closeModal}
            userId={userId || ""}
            userName={userName || ""}
            userIntroduction={userIntroduction || ""}
            userIcon={userIcon || ""}
          />
        )}
        <div className="min-h-screen w-3/5 border-x border-gray-800 xl:w-[600px]">
          {/* プロフィールヘッダー */}
          <div className="bg-opacity-80 sticky top-0 z-10 flex items-center border-b border-gray-800 bg-black p-2 backdrop-blur-md">
            {/* 戻るボタン */}
            <Link href="/" className="mr-4">
              <ArrowLeft className="text-white" />
            </Link>

            <div>
              <p className="text-xl font-bold text-white">{userName}</p>
              <p className="text-sm text-gray-500">{posts.length}件のポスト</p>
            </div>
          </div>

          {/* プロフィールカバー画像 */}
          <div className="relative h-48 bg-gray-800">
            {/* プロフィール画像 */}
            <div className="absolute -bottom-12 left-4 overflow-hidden rounded-full sm:-bottom-16">
              <div className="mr-4">
                <div className="h-24 w-24 rounded-full bg-black sm:h-32 sm:w-32">
                  <Image
                    src={userIcon || "/default-icon.png"}
                    alt="user icon"
                    width={128}
                    height={128}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="border-b border-gray-800 px-4 pt-20 pb-4">
            {/* プロフィール編集ボタン */}
            <div className="mt-2 mb-4 flex justify-end">
              {/* isOwnerがtrueの場合のみボタンを表示 */}
              {isOwner && (
                <button
                  className="rounded-full border border-gray-500 px-4 py-1.5 font-bold text-white"
                  onClick={openModal} // 関数を直接渡す
                >
                  プロフィールを編集
                </button>
              )}
              {/* フォロー/アンフォローボタン (オーナー以外に表示) */}
              {!isOwner && (
                <button
                  className={`rounded-full px-4 py-1.5 font-bold ${
                    isLoadingFollow
                      ? "cursor-not-allowed border border-gray-600 bg-gray-700 text-gray-400"
                      : isFollowing
                        ? "border border-gray-500 bg-transparent text-white hover:border-red-600 hover:bg-red-900/30 hover:text-red-500"
                        : "border-0 bg-white text-black hover:bg-gray-200"
                  }`}
                  onClick={handleFollowToggle}
                  disabled={isLoadingFollow}
                >
                  {isLoadingFollow
                    ? "処理中..."
                    : isFollowing
                      ? "フォロー中"
                      : "フォローする"}
                </button>
              )}
            </div>

            <div>
              <p className="text-xl font-bold text-white">{userName}</p>
              <p className="mt-3 text-white">{userIntroduction}</p>

              {/* 登録日 */}
              <p className="mt-2 flex items-center text-gray-500">
                <CalendarDays className="mr-1 h-4 w-4" />
                {userCreatedAt}
              </p>

              {/* フォロー・フォロワー */}
              <div className="mt-3 flex items-center space-x-4 text-gray-300">
                <p>
                  <span className="font-bold text-white">{followingCount}</span>{" "}
                  <span className="text-gray-500">フォロー中</span>
                </p>
                <p>
                  <span className="font-bold text-white">{followerCount}</span>{" "}
                  <span className="text-gray-500">フォロワー</span>
                </p>
              </div>
            </div>
          </div>

          {/* タブメニュー */}
          <div className="flex border-b border-gray-800">
            <button className="flex-1 border-b-4 border-blue-500 py-4 font-bold text-white">
              ポスト
            </button>
            <button className="flex-1 py-4 text-gray-500">返信</button>
            <button className="flex-1 py-4 text-gray-500">メディア</button>
            <button className="flex-1 py-4 text-gray-500">いいね</button>
          </div>

          {/* ポスト一覧 */}
          <Post posts={posts || []} />
        </div>

        {/* ライトサイドバー */}
        <div className="w-1/5 xl:w-[350px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
