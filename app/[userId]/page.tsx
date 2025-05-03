import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profile")
    .select("name, introduction, icon")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    console.error(
      "Error fetching profile or profile not found:",
      error?.message
    );
    notFound();
  }

  const userName = profile.name || "名前未設定";
  const userIntroduction = profile.introduction || "";
  const userIcon = profile.icon || "/default-icon.png";

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="w-full max-w-3xl border-b border-gray-700 bg-gray-900 p-4">
        <h2 className="text-xl font-bold">{userName}</h2>
      </div>
      <div className="w-full max-w-3xl p-4">
        <div className="relative mb-16">
          <div className="h-48 rounded-t-lg bg-gray-700"></div>
          <div className="absolute -bottom-12 left-4">
            <Image
              src={userIcon}
              alt={`${userName}'s Icon`}
              width={100}
              height={100}
              className="rounded-full border-4 border-black bg-gray-500 object-cover"
            />
          </div>
          <div className="absolute top-4 right-4">
            <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600">
              フォロー (仮)
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{userName}</h1>
          <p className="text-gray-500">@{userId}</p>
          {userIntroduction && <p className="pt-2">{userIntroduction}</p>}
        </div>
        <div className="mt-4 border-b border-gray-700">
          <nav className="flex space-x-4">
            <button className="border-b-2 border-blue-500 px-4 py-3 font-bold text-white">
              ポスト (仮)
            </button>
          </nav>
        </div>
        <div className="mt-4">
          <p className="py-8 text-center text-gray-500">
            まだ投稿がありません。(仮)
          </p>
        </div>
      </div>
    </div>
  );
}
