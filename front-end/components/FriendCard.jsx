import Image from "next/image";

import { formatTime } from "@utils/commonFunctions";
import DefaultProfile from "@public/assets/default-profile-image.jpg";

const FriendCard = ({ user }) => {
  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
      <div className="flex gap-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={user.profilePic ? `${user.profilePic}` : DefaultProfile}
            alt="user image"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white text-sm truncate">
            {user.username}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {user.bio || "No bio"}
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-500 ml-2 flex-shrink-0 whitespace-nowrap">
        {formatTime(user.updatedAt)}
      </div>
    </div>
  );
};

export default FriendCard;
