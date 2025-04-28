"use client";

import React from "react";

type ReplyFormProps = {
  postId: string;
  userId: string;
};

export const ReplyForm = ({ postId, userId }: ReplyFormProps) => {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex">
        <div className="mr-3">
          <div className="w-10 h-10 rounded-full bg-gray-600"></div>
        </div>
        <div className="flex-1 mt-1.5">
          <textarea
            placeholder="返信をポスト"
            className="w-full bg-transparent text-white text-xl outline-none resize-none"
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <button
              className="bg-white text-black px-4 py-1.5 rounded-full font-bold cursor-pointer"
              onClick={() =>
                console.log(`Replying to post ${postId} by user ${userId}`)
              }
            >
              返信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
