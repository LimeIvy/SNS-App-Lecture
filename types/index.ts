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
