"use client";

import { Users as UsersIcon } from "lucide-react";

interface UserListProps {
  users: string[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="h-full flex flex-col p-4 halftone-bg-dark">
      <h3 className="font-marker text-2xl text-spider-red flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
        <UsersIcon size={24} />
        MULTIVERSE ({users.length}/100)
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {users.map((user, index) => (
          <div 
            key={index}
            className="bg-white border-2 border-black p-2 font-fredoka font-bold text-sm text-spider-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-spider-red hover:text-white transition-colors cursor-default transform hover:-rotate-1"
          >
            {user}
          </div>
        ))}
      </div>
    </div>
  );
}
