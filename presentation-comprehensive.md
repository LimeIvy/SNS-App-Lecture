---
marp: true
theme: default
paginate: true
backgroundColor: #1a1a1a
color: white
header: "**X クローン開発総合講座**"
footer: "© 2023 X Clone Project"
---

# **X クローン開発総合講座**

## **～フルスタック実装から運用まで～**

---

# 講座の目標

- Next.js プロジェクトの構築と認証基盤の実装
- Prisma を使った堅牢なデータモデリングと管理
- Supabase Storage による画像管理の実装
- リアルタイム機能と検索機能の実装
- テスト導入とデプロイまでの CI/CD パイプライン構築

---

# 環境構築

```bash
# プロジェクト作成
npx create-next-app@latest x-clone --typescript

# 必要なパッケージをインストール
cd x-clone
npm install @clerk/nextjs @prisma/client @supabase/supabase-js lucide-react
npm install -D prisma typescript ts-node

# テスト用パッケージ
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

---

# アプリケーション設計

**全体アーキテクチャ**:

1. **フロントエンド**: Next.js + React
2. **認証**: Clerk Auth
3. **データベース**: PostgreSQL + Prisma ORM
4. **ストレージ**: Supabase Storage
5. **リアルタイム**: Supabase Realtime

---

# プロジェクト構成

```
x-clone/
├── app/                 # Next.js App Router
├── components/          # React コンポーネント
├── lib/                 # ユーティリティ関数
├── prisma/              # Prismaスキーマと設定
├── public/              # 静的ファイル
├── middleware.ts        # 認証ミドルウェア
└── package.json         # 依存関係
```

---

# Clerk 認証セットアップ

1. [clerk.com](https://clerk.com/) でアカウント作成
2. 新しいアプリケーションを作成
3. API キーを取得

`.env.local`ファイルを作成:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_●●●●●●●●●●●●●●●●●●●●●●●●
CLERK_SECRET_KEY=sk_test_●●●●●●●●●●●●●●●●●●●●●●●●
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

# 認証の基本設定

`/app/layout.tsx`:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="bg-black text-white">{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

# ミドルウェア設定

`/middleware.ts`:

```tsx
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/sign-in", "/sign-up", "/api/webhook"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

---

# サインイン・サインアップページ

`/app/sign-in/[[...sign-in]]/page.tsx`:

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

`/app/sign-up/[[...sign-up]]/page.tsx`:

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

---

# アプリケーションのレイアウト

```tsx
// components/Layout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import MobileNavigation from "./MobileNavigation";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* 左サイドバー (デスクトップ) */}
      <div className="hidden md:block w-1/5 border-r border-gray-800">
        <Sidebar />
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 w-full md:w-3/5 min-h-screen border-x border-gray-800">
        {children}
      </main>

      {/* 右サイドバー (デスクトップ) */}
      <div className="hidden lg:block w-1/5 border-l border-gray-800">
        <RightSidebar />
      </div>

      {/* モバイルナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
}
```

---

# Prisma のセットアップ

```bash
# Prismaの初期化
npx prisma init
```

`.env`ファイルに接続情報を追加:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

---

# データベースモデリング

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(uuid())
  clerkId     String   @unique
  username    String   @unique
  fullName    String?
  bio         String?
  avatarUrl   String?
  coverUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts       Post[]
  likes       Like[]
  retweets    Retweet[]
  followedBy  Follow[] @relation("following")
  following   Follow[] @relation("follower")
  replies     Reply[]
  notifications Notification[]
  notificationsFrom Notification[] @relation("notificationFrom")
}

model Post {
  id        String   @id @default(uuid())
  content   String
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  likes     Like[]
  retweets  Retweet[]
  replies   Reply[]
  notifications Notification[]
}

model Like {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
}

model Retweet {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
}

model Follow {
  id          String   @id @default(uuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower    User     @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("following", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
}

model Reply {
  id        String   @id @default(uuid())
  content   String
  imageUrl  String?
  createdAt DateTime @default(now())
  postId    String
  userId    String

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  fromUserId String
  content   String
  type      String   // like, retweet, reply, follow
  postId    String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fromUser  User     @relation("notificationFrom", fields: [fromUserId], references: [id], onDelete: Cascade)
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

---

# Prisma クライアントのセットアップ

```tsx
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

# データベースマイグレーション

```bash
# マイグレーションの作成と適用
npx prisma migrate dev --name init

# 開発データベースにシードデータを追加
npx prisma db seed
```

`package.json`にシードスクリプトを追加:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

---

# シードスクリプトの例

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // サンプルユーザーを作成
  const user1 = await prisma.user.upsert({
    where: { clerkId: "user_test_1" },
    update: {},
    create: {
      clerkId: "user_test_1",
      username: "testuser1",
      fullName: "テストユーザー1",
      avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=1",
    },
  });

  // サンプル投稿を作成
  await prisma.post.createMany({
    data: [
      {
        content: "はじめてのポスト！",
        userId: user1.id,
      },
      {
        content: "Next.jsとPrismaでTwitterクローンを作成中...",
        userId: user1.id,
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

# Supabase Storage のセットアップ

1. [supabase.com](https://supabase.com/)でアカウント作成
2. 新しいプロジェクトを作成
3. API キーを取得

`.env.local`に追加:

```
NEXT_PUBLIC_SUPABASE_URL=https://●●●●●●●●●●●●●●.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
```

---

# Supabase クライアント設定

```tsx
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

---

# Storage バケットの作成

Supabase ダッシュボードで:

1. Storage セクションに移動
2. 新しいバケットを作成:
   - `avatars` - プロフィール画像用
   - `posts` - 投稿画像用
3. アクセス制御ポリシーを設定

---

# 画像アップロードコンポーネント

```tsx
// components/ImageUploader.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Upload, Loader2 } from "lucide-react";

type ImageUploaderProps = {
  onUploadComplete: (url: string) => void;
  bucketName: string;
  folderPath?: string;
};

export default function ImageUploader({
  onUploadComplete,
  bucketName,
  folderPath = "",
}: ImageUploaderProps) {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      // ファイル名を生成（ユニークになるようにタイムスタンプを付加）
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      // Supabase Storageにアップロード
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) throw error;

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600">
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>アップロード中...</span>
          </>
        ) : (
          <>
            <Upload size={18} />
            <span>画像をアップロード</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
```

---

# 投稿フォームの実装

```tsx
// components/PostForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, X, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

export default function PostForm() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isLoaded || !user) return;

    setIsSubmitting(true);

    try {
      // 投稿APIを呼び出し
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          imageUrl: imageUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error("投稿に失敗しました");
      }

      // フォームをリセット
      setContent("");
      setImageUrl("");

      // タイムラインを更新
      router.refresh();
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const removeImage = () => {
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-800 p-4">
      <div className="flex">
        {user?.imageUrl && (
          <div className="mr-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={user.imageUrl}
                alt={user.username || "User"}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いまどうしてる？"
            className="w-full bg-transparent border-none outline-none text-white resize-none"
            rows={3}
            maxLength={280}
          />

          {imageUrl && (
            <div className="relative mt-2 mb-4">
              <div className="rounded-lg overflow-hidden max-w-md">
                <Image
                  src={imageUrl}
                  alt="投稿画像"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1 text-white"
                aria-label="画像を削除"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <ImageUploader
                onUploadComplete={handleImageUpload}
                bucketName="posts"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">
                {280 - content.length}
              </span>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>投稿中...</span>
                  </>
                ) : (
                  <span>ポストする</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
```

---

# API エンドポイント実装

```tsx
// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

// 投稿を作成するエンドポイント
export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, imageUrl } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // Clerkユーザーに紐づくPrismaユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // 投稿を作成
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        userId: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// タイムラインの投稿を取得するエンドポイント
export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // フォロー中のユーザーのIDを取得
    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    // タイムライン取得（自分の投稿とフォローしているユーザーの投稿）
    const posts = await prisma.post.findMany({
      where: {
        OR: [{ userId: user.id }, { userId: { in: followingIds } }],
      },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        likes: {
          where: { userId: user.id },
          select: { id: true },
        },
        retweets: {
          where: { userId: user.id },
          select: { id: true },
        },
        _count: {
          select: {
            likes: true,
            retweets: true,
            replies: true,
          },
        },
      },
    });

    let nextCursor = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({
      items: posts,
      nextCursor,
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

---

# いいね・リツイート機能の実装

```tsx
// app/api/posts/[id]/like/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const postId = params.id;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // いいねが既に存在するか確認
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    // 既にいいねしている場合は削除（いいね解除）
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      return NextResponse.json({ liked: false });
    }

    // いいねを作成
    await prisma.like.create({
      data: {
        userId: user.id,
        postId,
      },
    });

    // 通知を作成（自分の投稿へのいいねでなければ）
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (post && post.userId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          fromUserId: user.id,
          content: "あなたの投稿にいいねしました",
          type: "like",
          postId,
        },
      });
    }

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("LIKE ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

---

# リアルタイム機能の実装

```tsx
// components/RealtimePosts.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Post from "./Post";
import { useUser } from "@clerk/nextjs";

type PostType = {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  likes: { id: string }[];
  retweets: { id: string }[];
  _count: {
    likes: number;
    retweets: number;
    replies: number;
  };
};

type RealtimePostsProps = {
  initialPosts: PostType[];
};

export default function RealtimePosts({ initialPosts }: RealtimePostsProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    // リアルタイムサブスクリプションを設定
    const channel = supabase
      .channel("posts-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Post",
        },
        async () => {
          // 投稿が更新されたら最新のタイムラインを取得
          const response = await fetch("/api/posts");
          if (response.ok) {
            const data = await response.json();
            setPosts(data.items);
          }
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
```

---

# 通知システムの実装

```tsx
// components/NotificationBell.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

type Notification = {
  id: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  fromUser: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  postId?: string;
};

export default function NotificationBell() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 未読通知数を取得
  const fetchUnreadCount = async () => {
    if (!user) return;

    const response = await fetch("/api/notifications/count");
    if (response.ok) {
      const data = await response.json();
      setUnreadCount(data.count);
    }
  };

  // 通知一覧を取得
  const fetchNotifications = async () => {
    if (!user) return;

    const response = await fetch("/api/notifications");
    if (response.ok) {
      const data = await response.json();
      setNotifications(data.notifications);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();

    // リアルタイム更新のセットアップ
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const toggleNotifications = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      await fetchNotifications();

      // 通知を既読にする
      if (unreadCount > 0) {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
        });
        setUnreadCount(0);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-800"
        aria-label="通知"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-black border border-gray-800 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-gray-800">
            <h3 className="font-bold">通知</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border-b border-gray-800 hover:bg-gray-900"
                >
                  <div className="flex items-start gap-2">
                    {notification.fromUser.avatarUrl && (
                      <Image
                        src={notification.fromUser.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p>
                        <span className="font-semibold">
                          {notification.fromUser.fullName}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          @{notification.fromUser.username}
                        </span>
                      </p>
                      <p className="text-sm">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                通知はありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

# 検索機能の実装

## 検索フォーム

```tsx
// components/SearchForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索"
          className="w-full bg-gray-900 border border-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500"
          aria-label="検索キーワードを入力"
        />
      </div>
    </form>
  );
}
```

## 検索ページ

```tsx
// app/search/page.tsx
import { prisma } from "@/lib/prisma";
import Post from "@/components/Post";
import UserCard from "@/components/UserCard";
import SearchForm from "@/components/SearchForm";

type SearchPageProps = {
  searchParams: { q?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  if (!query) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800">
          <SearchForm />
        </div>
        <div className="p-8 text-center text-gray-500">
          キーワードを入力して検索してください
        </div>
      </div>
    );
  }

  // フルテキスト検索のための前処理
  const searchQuery = query
    .split(" ")
    .filter(Boolean)
    .map((term) => term + ":*")
    .join(" & ");

  // 投稿検索
  const posts = await prisma.$queryRaw`
    SELECT p.*, 
           ts_rank(to_tsvector('japanese', p.content), to_tsquery('japanese', ${searchQuery})) as rank,
           json_build_object(
             'id', u.id,
             'username', u.username,
             'fullName', u."fullName",
             'avatarUrl', u."avatarUrl"
           ) as "user",
           (SELECT COUNT(*) FROM "Like" WHERE "postId" = p.id) as "likeCount",
           (SELECT COUNT(*) FROM "Retweet" WHERE "postId" = p.id) as "retweetCount",
           (SELECT COUNT(*) FROM "Reply" WHERE "postId" = p.id) as "replyCount"
    FROM "Post" p
    JOIN "User" u ON p."userId" = u.id
    WHERE to_tsvector('japanese', p.content) @@ to_tsquery('japanese', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `;

  // ユーザー検索
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { fullName: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
  });

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800">
        <SearchForm />
      </div>

      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">「{query}」の検索結果</h1>
      </div>

      {users.length > 0 && (
        <div className="border-b border-gray-800 pb-4">
          <h2 className="font-bold p-4">ユーザー</h2>
          <div>
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {posts.length > 0 ? (
        <div>
          <h2 className="font-bold p-4">投稿</h2>
          {posts.map((post: any) => (
            <Post
              key={post.id}
              post={{
                ...post,
                createdAt: new Date(post.createdAt).toISOString(),
                _count: {
                  likes: Number(post.likeCount),
                  retweets: Number(post.retweetCount),
                  replies: Number(post.replyCount),
                },
              }}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          「{query}」に一致する投稿は見つかりませんでした
        </div>
      )}
    </div>
  );
}
```

---

# 検索最適化 - インデックス作成

PostgreSQL での検索インデックス作成:

```sql
-- 通常の検索用インデックス
CREATE INDEX posts_content_idx ON "Post" USING gin(to_tsvector('japanese', content));
CREATE INDEX users_username_idx ON "User" USING btree(username);
CREATE INDEX users_fullname_idx ON "User" USING btree("fullName");

-- トリグラムインデックス（あいまい検索用）
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX users_username_trgm_idx ON "User" USING gin(username gin_trgm_ops);
CREATE INDEX users_fullname_trgm_idx ON "User" USING gin("fullName" gin_trgm_ops);
```

---

# テスト環境の設定

`jest.config.js` ファイルを作成:

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

module.exports = createJestConfig(customJestConfig);
```

`jest.setup.js` ファイルを作成:

```javascript
import "@testing-library/jest-dom";

// mockするグローバル関数
global.fetch = jest.fn();

// mock環境変数
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test";
process.env.CLERK_SECRET_KEY = "sk_test";
process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL = "/sign-in";
process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL = "/sign-up";
process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = "/";
process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = "/";
```

---

# ユニットテストの例

```tsx
// __tests__/components/Post.test.tsx
import { render, screen } from "@testing-library/react";
import Post from "@/components/Post";

// モック
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: { id: "user_123" }, isLoaded: true }),
}));

describe("Post Component", () => {
  const mockPost = {
    id: "post_123",
    content: "テスト投稿です",
    createdAt: new Date().toISOString(),
    user: {
      id: "user_123",
      username: "testuser",
      fullName: "テストユーザー",
      avatarUrl: "https://example.com/avatar.jpg",
    },
    likes: [],
    retweets: [],
    _count: {
      likes: 0,
      retweets: 0,
      replies: 0,
    },
  };

  it("正しく投稿内容を表示すること", () => {
    render(<Post post={mockPost} />);

    expect(screen.getByText("テスト投稿です")).toBeInTheDocument();
    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it("いいね・リツイート・返信のカウントを表示すること", () => {
    render(<Post post={mockPost} />);

    expect(screen.getByText("0")).toBeInTheDocument(); // いいね数
  });
});
```

---

# 統合テストの例

```tsx
// __tests__/api/posts.test.ts
import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/posts/route";

// Prisma モック
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: "test-user-id",
        clerkId: "test-clerk-id",
      }),
    },
    post: {
      create: jest.fn().mockResolvedValue({
        id: "test-post-id",
        content: "Test content",
        userId: "test-user-id",
      }),
    },
  },
}));

// Clerk Auth モック
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn().mockReturnValue({
    userId: "test-clerk-id",
  }),
}));

describe("POST /api/posts", () => {
  it("投稿を作成できること", async () => {
    const { req } = createMocks({
      method: "POST",
      body: {
        content: "Test content",
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id", "test-post-id");
    expect(data).toHaveProperty("content", "Test content");
  });
});
```

---

# E2E テスト

`playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

E2E テストの例:

```typescript
// e2e/home.spec.ts
import { test, expect } from "@playwright/test";

test("ホームページが表示されること", async ({ page }) => {
  await page.goto("/");

  // ログインページにリダイレクトされるか確認
  await expect(page).toHaveURL(/sign-in/);

  // ログインページのタイトルを確認
  await expect(page.locator("h1")).toContainText("Sign In");
});
```

---

# アクセシビリティ対応

キーボードナビゲーション対応:

```tsx
// components/AccessibleButton.tsx
"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

type AccessibleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, className, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        aria-label={label}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";

export default AccessibleButton;
```

---

# デプロイ準備

## 環境変数管理

環境ごとに設定ファイルを分けて管理:

- `.env.development` - 開発環境用
- `.env.production` - 本番環境用
- `.env.test` - テスト用

```
# .env.production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_●●●●●●●●●●●●●●●●●●●●●●●●
CLERK_SECRET_KEY=sk_live_●●●●●●●●●●●●●●●●●●●●●●●●
NEXT_PUBLIC_SUPABASE_URL=https://●●●●●●●●.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
DATABASE_URL=postgresql://●●●●●●●●●●●●●●●●●●●●
```

## ビルド最適化

`next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "your-supabase-project.supabase.co",
      "img.clerk.com",
    ],
  },
  // 追加の最適化設定
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
```

---

# CI/CD パイプライン構築

## GitHub Actions 設定

`.github/workflows/ci.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test

  build:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

# Vercel へのデプロイ

1. GitHub リポジトリの準備

   - プロジェクトを GitHub にプッシュ

2. Vercel 連携

   - Vercel アカウント作成
   - GitHub リポジトリのインポート
   - フレームワークプリセットとして Next.js を選択

3. 環境変数の設定

   - すべての本番環境用環境変数を Vercel ダッシュボードで設定

4. デプロイ設定

   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `.next`
   - インストールコマンド: `npm ci`

5. 自動デプロイの設定
   - main ブランチへのプッシュで自動デプロイ

---

# パフォーマンスモニタリング

## Vercel Analytics の設定

```bash
# Vercel Analytics のインストール
npm install @vercel/analytics
```

`app/layout.tsx` に Analytics を追加:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="bg-black text-white">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

# サーバー側レンダリングの最適化

```tsx
// app/post/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import Loading from "./loading";

// ページデータの再検証設定（60秒ごと）
export const revalidate = 60;

// 静的に生成するパスを指定（人気の投稿は静的に生成）
export async function generateStaticParams() {
  const popularPosts = await prisma.post.findMany({
    take: 20,
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    select: {
      id: true,
    },
  });

  return popularPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: {
          likes: true,
          retweets: true,
          replies: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-start gap-3">{/* 投稿内容表示 */}</div>
      </div>

      <Suspense fallback={<Loading />}>
        {/* 遅延読み込みするコンテンツ */}
      </Suspense>
    </div>
  );
}
```

---

# まとめ

本講座で学んだこと:

- Clerk 認証を使ったセキュアなユーザー管理
- Prisma を使った型安全なデータベースアクセス
- Supabase Storage による画像管理
- リアルタイムデータ更新の実装
- 効率的な検索機能の構築
- テスト導入によるコード品質の向上
- CI/CD パイプラインの構築
- パフォーマンス最適化とモニタリング

---

# 次のステップ

- ハッシュタグ機能の実装
- 多言語対応
- Push 通知の追加
- モバイルアプリ（React Native）との連携
- マイクロサービス化（サービスの分割）
- スケーラビリティの向上

---

# お疲れ様でした！

![完成イメージ](https://via.placeholder.com/800x450.png?text=完成したXクローンのイメージ)

**ぜひ自分だけのオリジナル機能を追加して、プロジェクトを発展させてください！**
