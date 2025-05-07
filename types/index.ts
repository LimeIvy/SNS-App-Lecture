// 共通の型定義をまとめるファイル

export interface Profile {
  id: string;
  name: string;
  introduction: string | null;
  icon: string | null;
}

// Postコンポーネント等で使用する投稿データの型
export interface PostWithProfile {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile: Profile; // 上で定義した Profile 型を使用 (存在しない場合も考慮)
}

// replies テーブルの基本的な型
export interface Reply {
  id: number;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
}

// replies テーブルと profile テーブルを結合したデータの型
export interface ReplyWithProfile extends Reply {
  profile: Profile | null;
}
