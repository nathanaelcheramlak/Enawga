import { formatTime } from "@utils/commonFunctions";

const ChatBubble = ({ message, createdAt, session }) => {
  return (
    <div className={`w-full flex ${session ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2.5 break-words ${
          session
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-100 rounded-bl-none'
        } shadow-md`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        <div className={`mt-1 text-xs ${session ? 'text-blue-100' : 'text-slate-400'} flex justify-end`}>
          {formatTime(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
