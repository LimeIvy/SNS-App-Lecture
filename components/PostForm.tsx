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
          <div className="flex-1 mt-1.5">
            <textarea
              placeholder="いまどうしてる？"
              className="w-full bg-transparent text-white text-xl outline-none resize-none"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button className="bg-white text-black px-4 py-1.5 rounded-full font-bold cursor-pointer">
                ポストする
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
