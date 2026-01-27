"use client";
import Image from "next/image";
import { useState } from "react";
import { Bell, ArrowLeft, Trash2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { trim } from "@utils/commonFunctions";
import Choice from "@components/Choice";
import DefaultProfile from "@public/assets/default-profile-image.jpg";

const ProfileCard = ({
  user,
  theme,
  changeTheme,
  changeBack,
  handleNotification,
  currentUser,
}) => {
  const [message, setMessage] = useState("");

  const onYes = async () => {};

  const onNo = () => {
    document
      .getElementById("choice-component")
      .classList.replace("fixed", "hidden");
  };

  const handleRemoveClicked = () => {
    setMessage(
      `Are you sure you want to remove ${user.fullName} from your friend list?`
    );
    document
      .getElementById("choice-component")
      ?.classList.replace("hidden", "fixed");
  };

  return (
    <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur px-6 py-4">
      {message.length > 0 && (
        <Choice message={message} onYes={onYes} onNo={onNo} />
      )}
      
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Back Button + Profile Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {!currentUser && changeBack && (
            <Button
              onClick={changeBack}
              size="sm"
              variant="ghost"
              className="lg:hidden text-slate-400 hover:text-slate-200 hover:bg-slate-700 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div 
            className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              document.getElementById('sidebar')?.dispatchEvent(
                new CustomEvent('openSidebar')
              );
            }}
          >
            <Image
              src={
                currentUser?.profilePic
                  ? `${currentUser.profilePic}`
                  : user?.profilePic
                  ? `${user.profilePic}`
                  : DefaultProfile
              }
              alt="profile image"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          {!currentUser && (
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">
                {user.fullName}
                <span className="ml-2 text-slate-400 font-normal text-sm">
                  @{user.username}
                </span>
              </h3>
              <p className="text-sm text-slate-400 truncate">
                {user.bio && user.bio.length > 0 ? trim(user.bio) : "No bio"}
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentUser && (
             <Button
               onClick={handleNotification}
               size="sm"
               variant="ghost"
               className="relative text-slate-400 hover:text-slate-200 hover:bg-slate-700"
             >
               <Bell className="h-5 w-5" />
               <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
             </Button>
           )}

           {!currentUser && (
            <Button
              onClick={handleRemoveClicked}
              size="sm"
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
