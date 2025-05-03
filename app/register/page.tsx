"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      alert(`登録エラー: ${error.message}`);
    } else {
      console.log("Sign up successful:", data);
      alert("登録が完了しました。");

      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-700 bg-black p-8 shadow-md">
        <Image
          src="/X.png"
          alt="logo"
          width={80}
          height={80}
          className="mx-auto"
        />
        <h2 className="text-center text-3xl font-bold text-white">
          アカウントを作成
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              名前
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:border-blue-400 focus:outline-none sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:border-blue-400 focus:outline-none sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-white focus:border-blue-400 focus:outline-none sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-3 w-full cursor-pointer rounded-md border bg-white py-2 font-semibold text-black hover:bg-gray-200 hover:shadow-lg"
            >
              アカウントを作成する
            </button>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-white">アカウントをお持ちの方は</p>
            <Link
              href="/login"
              className="relative text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 hover:after:w-full"
            >
              ログイン
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
