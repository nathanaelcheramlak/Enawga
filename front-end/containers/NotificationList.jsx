import { X, MessageCircle } from "lucide-react";
import { Button } from "@components/ui/button";

import { formatTime } from "@utils/commonFunctions";

const NotificationList = ({ messageList, handleNotification, handleMessageClick }) => {
  return (
    <div className="z-10 fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
          <h3 className="text-white font-semibold">Notifications</h3>
          <Button
            onClick={handleNotification}
            size="sm"
            variant="ghost"
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages List */}
        {messageList.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            {messageList.map((message, index) => (
              <div
                key={index}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer p-4"
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate text-sm">
                      {message.senderId}
                    </h3>
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {message.message_content}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 p-6">
            <MessageCircle className="h-16 w-16 opacity-50" />
            <div className="text-center">
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You&apos;re all caught up!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
