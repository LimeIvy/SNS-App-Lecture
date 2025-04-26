import React from "react";
import { Search } from "lucide-react";

export const RightSidebar = () => {
  return (
    <div className="fixed top-0 right-0 h-screen text-white">
      {/* 検索バー */}
      <div className="h-full bg-black w-64 pt-4 border-l-1 border-gray-600">
        <div className="bg-black border-1 border-gray-600 rounded-full p-2.5 mx-6 flex items-center">
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
