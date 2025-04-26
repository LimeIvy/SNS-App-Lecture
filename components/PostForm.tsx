import React from "react";

export const PostForm = () => {
  return (
    <div>
      {/* 投稿フォーム */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex">
          <div className="mr-4">
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
          </div>
          {/* 入力フォーム */}
          <div className="flex-1 relative mt-1.5">
            <textarea
              placeholder="いまどうしてる？"
              className="w-full bg-transparent text-white text-xl outline-none resize-none mb-5"
              rows={2}
            />
            {/* ポストボタン */}
            <button className="absolute bottom-0 right-0 bg-white text-black px-4 py-2 text-sm rounded-full font-bold cursor-pointer">
              ポストする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
