import React from "react";
import { Search } from "lucide-react";

export const RightSidebar = () => {
  return (
    <div className="sticky top-0 h-screen overflow-y-auto">
      {/* 検索バー */}
      <div className="sticky top-0 bg-black pt-2 pb-4 z-10">
        <div className="bg-gray-900 rounded-full p-3 mx-4 flex items-center">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="検索"
            className="bg-transparent border-none text-white w-full outline-none"
          />
        </div>
      </div>
    </div>
  );
};
