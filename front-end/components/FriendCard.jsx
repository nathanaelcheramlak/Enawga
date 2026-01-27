"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { formatTime } from "@utils/commonFunctions";
import { getAuthHeader } from "@utils/tokenManager";
import DefaultProfile from "@public/assets/default-profile-image.jpg";
import UserBioModal from "./UserBioModal";
import { initializeSocket } from "@utils/socket";

const FriendCard = ({ user, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const socket = initializeSocket(currentUserId);

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages/user/${user._id}`,
            {
              headers: getAuthHeader(),
            }
          );

        if (response.ok) {
          const messages = await response.json();
          if (messages && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            setLastMessage(lastMsg.message_content || "");
          }
        }
      } catch (error) {
        console.error("Error fetching last message:", error);
      }
    };

    if (user?._id) {
      fetchLastMessage();
    }
  }, [user?._id]);

  // Listen for new messages via socket
  useEffect(() => {
    const handleNewMessage = (message) => {
      // Update last message if it's from this user
      if (message.senderId === user._id || message.receiverId === user._id) {
        setLastMessage(message.message_content || "");
      }
    };

    socket.on("newIncomingMessage", handleNewMessage);

    return () => {
      socket.off("newIncomingMessage", handleNewMessage);
    };
  }, [user?._id, socket]);

  return (
    <>
      <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
        <div className="flex gap-4 flex-1 min-w-0">
          {/* Profile Picture - Clickable */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src={user.profilePic ? `${user.profilePic}` : DefaultProfile}
              alt="user image"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </button>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-sm truncate">
              {user.username}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {lastMessage || "No messages yet"}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 ml-2 flex-shrink-0 whitespace-nowrap">
          {formatTime(user.updatedAt)}
        </div>
      </div>

      {/* User Bio Modal */}
      <UserBioModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FriendCard;
