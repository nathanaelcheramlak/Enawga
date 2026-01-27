"use client";

import { Search, Users } from "lucide-react";
import { Button } from "@components/ui/button";

import ProfileCard from "@components/ProfileCard";
import FriendCard from "@components/FriendCard";

const FriendList = ({
   friends,
   theme,
   handleClickedUser,
   changeTheme,
   handleNotification,
   currentUser,
   changeBack,
   unreadCount,
 }) => {
  return (
    <div className="flex-[0.25] bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col h-full min-w-0">
      {/* Header with Profile Card */}
      <div>
        <ProfileCard
          theme={theme}
          changeTheme={changeTheme}
          handleNotification={handleNotification}
          currentUser={currentUser}
          unreadCount={unreadCount}
        />
      </div>

      {/* Search Button */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur px-4 py-3">
        <Button
          onClick={() => {
            document
              .getElementById("search_container")
              .classList.replace("hidden", "fixed");
          }}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 gap-2 justify-center"
        >
          <Search className="h-4 w-4" />
          Find new friends
        </Button>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div
              key={index}
              onClick={() => {
                handleClickedUser(friend);
                if (changeBack) {
                  changeBack();
                }
              }}
              className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <FriendCard user={friend} />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <Users className="h-16 w-16 opacity-50" />
            <div className="text-center">
              <p className="text-lg font-medium">No friends yet</p>
              <p className="text-sm">Use the search button to find and add friends</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
