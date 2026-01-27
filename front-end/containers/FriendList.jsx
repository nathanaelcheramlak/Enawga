"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Users } from "lucide-react";
import { Button } from "@components/ui/button";

import ProfileCard from "@components/ProfileCard";
import FriendCard from "@components/FriendCard";
import { initializeSocket, disconnectSocket } from "../utils/socket.js";

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
  const [friendsList, setFriendsList] = useState(friends);
  const socket = useRef(initializeSocket(currentUser?._id));

  // Hook: Listen for real-time updates
  useEffect(() => {
    const currentSocket = socket.current;

    currentSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Listen for new incoming messages to update friend order
    currentSocket.on("newIncomingMessage", (message) => {
      setFriendsList((prevFriends) => {
        // Check if sender is already in friends list
        const senderExists = prevFriends.some(
          (friend) => friend._id === message.senderId
        );

        // If sender exists, update the friend's last message
        if (senderExists) {
          return prevFriends.map((friend) =>
            friend._id === message.senderId
              ? {
                  ...friend,
                  lastMessage: message.message_content,
                  updatedAt: message.createdAt,
                }
              : friend
          );
        }

        return prevFriends;
      });
    });

    // Listen for new conversation creation
    currentSocket.on("newConversation", (newFriend) => {
      setFriendsList((prevFriends) => {
        // Avoid duplicates
        const friendExists = prevFriends.some(
          (friend) => friend._id === newFriend._id
        );
        if (!friendExists) {
          return [newFriend, ...prevFriends];
        }
        return prevFriends;
      });
    });

    return () => {
      currentSocket.off("newIncomingMessage");
      currentSocket.off("newConversation");
    };
  }, [currentUser?._id]);

  // Sync parent friends with local state
  useEffect(() => {
    setFriendsList(friends);
  }, [friends]);

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
        {friendsList.length > 0 ? (
          friendsList.map((friend, index) => (
            <div
              key={friend._id || index}
              onClick={() => {
                handleClickedUser(friend);
                if (changeBack) {
                  changeBack();
                }
              }}
              className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <FriendCard user={friend} currentUserId={currentUser._id} />
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
