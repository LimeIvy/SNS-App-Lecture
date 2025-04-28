// 投稿データの型定義
export type PostData = {
  id: string;
  username: string;
  userId: string;
  time: string;
  content: string;
  comments: number;
  retweets: number;
  likes: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
};

// サンプル投稿データ
export const posts: PostData[] = [
  {
    id: "1",
    username: "じろう",
    userId: "jiro",
    time: "2時間",
    content: "おはようございます！今日も一日頑張りましょう！",
    comments: 12,
    retweets: 24,
    likes: 148,
  },
  {
    id: "2",
    username: "たろう",
    userId: "taro",
    time: "3時間",
    content:
      "新しい技術を勉強中です。React と Next.js は本当に素晴らしいです！",
    comments: 5,
    retweets: 8,
    likes: 42,
  },
  {
    id: "3",
    username: "はなこ",
    userId: "hanako",
    time: "5時間",
    content: "今日の夕食はカレーライスでした。とても美味しかったです！😋🍛",
    comments: 3,
    retweets: 1,
    likes: 15,
  },
  {
    id: "4",
    username: "けんじ",
    userId: "kenji",
    time: "12時間",
    content:
      "新しいプロジェクトを始めました。Xクローンアプリの開発が楽しみです！#プログラミング #Next.js",
    comments: 8,
    retweets: 12,
    likes: 35,
  },
  {
    id: "5",
    username: "あきこ",
    userId: "akiko",
    time: "1日",
    content: "週末は友達と海に行ってきました！とても楽しかったです。🌊🏖️",
    comments: 15,
    retweets: 7,
    likes: 89,
  },
  {
    id: "6",
    username: "まさこ",
    userId: "masako",
    time: "1日",
    content: "週末は友達と海に行ってきました！とても楽しかったです。🌊🏖️",
    comments: 15,
    retweets: 7,
    likes: 89,
  },
  {
    id: "7",
    username: "さくら",
    userId: "sakura",
    time: "1日",
    content: "週末は友達と海に行ってきました！とても楽しかったです。🌊🏖️",
    comments: 15,
    retweets: 7,
    likes: 89,
  },
];

// サンプル投稿データ
export const myPosts: PostData[] = [
  {
    id: "1",
    username: "aaa",
    userId: "aaa",
    time: "2時間",
    content: "おはようございます！今日も一日頑張りましょう！",
    comments: 12,
    retweets: 24,
    likes: 148,
  },
  {
    id: "2",
    username: "aaa",
    userId: "aaa",
    time: "3時間",
    content:
      "新しい技術を勉強中です。React と Next.js は本当に素晴らしいです！",
    comments: 5,
    retweets: 8,
    likes: 42,
  },
  {
    id: "3",
    username: "aaa",
    userId: "aaa",
    time: "5時間",
    content: "今日の夕食はカレーライスでした。とても美味しかったです！😋🍛",
    comments: 3,
    retweets: 1,
    likes: 15,
  },
  {
    id: "4",
    username: "aaa",
    userId: "aaa",
    time: "12時間",
    content:
      "新しいプロジェクトを始めました。Xクローンアプリの開発が楽しみです！#プログラミング #Next.js",
    comments: 8,
    retweets: 12,
    likes: 35,
  },
  {
    id: "5",
    username: "aaa",
    userId: "aaa",
    time: "1日",
    content: "週末は友達と海に行ってきました！とても楽しかったです。🌊🏖️",
    comments: 15,
    retweets: 7,
    likes: 89,
  },
  {
    id: "6",
    username: "aaa",
    userId: "aaa",
    time: "1日",
    content: "週末は友達と海に行ってきました！とても楽しかったです。🌊🏖️",
    comments: 15,
    retweets: 7,
    likes: 89,
  },
  {
    id: "7",
    username: "aaa",
    userId: "aaa",
    time: "1日",
    content: "週末は友達と海に行ってきました！とても楽しかったです。🌊🏖️",
    comments: 15,
    retweets: 7,
    likes: 89,
  },
];
