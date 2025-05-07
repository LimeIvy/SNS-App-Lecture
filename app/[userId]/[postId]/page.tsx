"use client";
import { ArrowLeft, Heart, MessageCircle, Repeat } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { ReplyForm } from "@/components/ReplyForm";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { PostWithProfile, ReplyWithProfile } from "@/types";
import { useState, useEffect } from "react";

export default function Page() {
  const params = useParams<{ userId: string; postId: string }>();
  const postId = params.postId;
  const supabase = createClient();

  const [post, setPost] = useState<PostWithProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState<boolean>(false);

  const [replies, setReplies] = useState<ReplyWithProfile[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);
  const [repliesError, setRepliesError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setIsLoadingReplies(true);
      setRepliesError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const { data: postData, error: fetchError } = await supabase
        .from("posts")
        .select("*, profile:profile(*)")
        .eq("id", postId)
        .single<PostWithProfile>();

      if (fetchError) {
        console.error("Post fetch error:", fetchError.message);
        setError("投稿の読み込みに失敗しました。");
        setPost(null);
        setLoading(false);
        setIsLoadingReplies(false);
        return;
      } else if (!postData) {
        setError("投稿が見つかりませんでした。");
        setPost(null);
        setLoading(false);
        setIsLoadingReplies(false);
        return;
      } else {
        setPost(postData);

        if (user && postData.user_id !== user.id) {
          try {
            const response = await fetch(
              `/api/users/${postData.user_id}/follow_status`
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

        try {
          const repliesResponse = await fetch(`/api/posts/${postId}/replies`);
          if (repliesResponse.ok) {
            const repliesData = await repliesResponse.json();
            setReplies(repliesData || []);
          } else {
            console.error(
              "返信一覧の取得に失敗しました。",
              repliesResponse.statusText
            );
            setRepliesError("返信の読み込みに失敗しました。");
          }
        } catch (e) {
          console.error("返信一覧の取得中にエラーが発生しました。", e);
          setRepliesError("返信の読み込み中にエラーが発生しました。");
        }
      }
      setLoading(false);
      setIsLoadingReplies(false);
    };

    fetchData();
  }, [postId, supabase]);

  const handleFollowToggle = async () => {
    if (
      !post ||
      !currentUserId ||
      isLoadingFollow ||
      post.user_id === currentUserId
    )
      return;

    setIsLoadingFollow(true);
    const targetUserId = post.user_id;

    try {
      let response;
      if (isFollowing) {
        response = await fetch(`/api/users/${targetUserId}/unfollow`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsFollowing(false);
        } else {
          console.error("アンフォローに失敗しました。", response.statusText);
        }
      } else {
        response = await fetch(`/api/users/${targetUserId}/follow`, {
          method: "POST",
        });
        if (response.ok || response.status === 409) {
          setIsFollowing(true);
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

  const handleReplySuccess = (newReply: unknown) => {
    setReplies((prevReplies) => [newReply as ReplyWithProfile, ...prevReplies]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-500">
        エラー: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        投稿が見つかりません。
      </div>
    );
  }

  const fullDate = post.created_at
    ? new Date(post.created_at).toLocaleString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "";

  return (
    <div className="flex justify-center bg-black">
      {/* コンテンツラッパー - 大画面ではコンテンツを中央に配置 */}
      <div className="flex w-full max-w-7xl">
        {/* レフトサイドバー */}
        <div className="w-1/5 xl:w-[275px]">
          <LeftSidebar />
        </div>

        {/* メインコンテンツ */}
        <div className="min-h-screen w-3/5 border-x border-gray-800 xl:w-[600px]">
          {/* ヘッダー */}
          <div className="bg-opacity-80 sticky top-0 z-10 flex items-center border-b border-gray-800 bg-black p-4 backdrop-blur-md">
            <Link href="/" className="mr-4">
              <ArrowLeft className="text-white" />
            </Link>
            <h1 className="text-xl font-bold text-white">ポスト</h1>
          </div>

          {/* 投稿詳細 */}
          <div className="border-b border-gray-800 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={`/${post.profile?.id || post.user_id}`}
                  className="mr-3"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={post.profile?.icon || "/default-icon.png"}
                      alt={post.profile?.name || "user icon"}
                      width={48}
                      height={48}
                    />
                  </div>
                </Link>
                <div>
                  <Link href={`/${post.profile?.id || post.user_id}`}>
                    <p className="font-bold text-white">
                      {post.profile?.name || "Unknown User"}
                    </p>
                  </Link>
                </div>
              </div>
              {currentUserId && post.user_id !== currentUserId && (
                <button
                  className={`rounded-full px-4 py-1.5 text-sm font-bold ${
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

            {/* 投稿内容 */}
            <div className="mb-4">
              <p className="mb-4 text-xl whitespace-pre-wrap text-white">
                {post.content}
              </p>

              <p className="mt-4 border-b border-gray-800 pb-4 text-gray-500">
                <time dateTime={post.created_at}>{fullDate}</time>
              </p>
            </div>

            {/* アクションボタン */}
            <div className="mt-3 flex w-full max-w-sm items-center gap-12 text-gray-500">
              {/* リプライ */}
              <button
                className="flex items-center hover:text-blue-500"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={18} />
              </button>
              {/* リツイート */}
              <button
                className="flex items-center hover:text-green-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Repeat size={18} />
              </button>
              {/* いいね */}
              <button
                className="flex items-center hover:text-pink-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          <ReplyForm
            postId={postId}
            userId={post.user_id}
            onReplySuccess={handleReplySuccess}
          />

          <div className="border-t border-gray-800">
            {isLoadingReplies && (
              <p className="p-4 text-center text-gray-500">
                返信を読み込み中...
              </p>
            )}
            {repliesError && (
              <p className="p-4 text-center text-red-500">
                エラー: {repliesError}
              </p>
            )}
            {!isLoadingReplies &&
              !repliesError &&
              replies.length > 0 &&
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="border-b border-gray-800 p-4 hover:bg-gray-900/50"
                >
                  <div className="flex">
                    <Link
                      href={`/${reply.profile?.id || reply.user_id}`}
                      className="mr-3 flex-shrink-0"
                    >
                      <Image
                        src={reply.profile?.icon || "/default-icon.png"}
                        alt={reply.profile?.name || "user icon"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </Link>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <Link href={`/${reply.profile?.id || reply.user_id}`}>
                          <span className="font-bold text-white">
                            {reply.profile?.name || "Unknown User"}
                          </span>
                        </Link>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString(
                            "ja-JP",
                            { month: "long", day: "numeric" }
                          )}
                        </span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-white">
                        {reply.content}
                      </p>
                      <div className="mt-3 flex items-center gap-12 text-gray-500">
                        {/* リプライ */}
                        <button
                          className="flex items-center hover:text-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={16} />
                        </button>
                        {/* リツイート */}
                        <button
                          className="flex items-center hover:text-green-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Repeat size={16} />
                        </button>
                        {/* いいね */}
                        <button
                          className="flex items-center hover:text-pink-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart size={16} />
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
