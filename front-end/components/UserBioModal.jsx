"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import DefaultProfile from "@public/assets/default-profile-image.jpg";

const UserBioModal = ({ user, isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?._id) {
      const fetchUserDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5000/api/search/user/${user._id}`,
            {
              credentials: "include",
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserDetails();
    }
  }, [isOpen, user?._id]);

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">User Profile</h2>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Profile Picture */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-600">
                  <Image
                    src={userDetails?.profilePic || DefaultProfile}
                    alt={userDetails?.username || "User"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                    Username
                  </p>
                  <p className="text-lg font-semibold text-white">
                    @{userDetails?.username || "N/A"}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                    Email
                  </p>
                  <p className="text-sm text-slate-200 break-all">
                    {userDetails?.email || "N/A"}
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                    Bio
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {userDetails?.bio || "No bio added"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserBioModal;
