import { MessageSquare } from "lucide-react";

const ChatList = ({
  names,
  selectedChat,
  setSelectedChat,
  setShowChatList,
  unread,
  isDoc = false,
}) => {
  return (
    <div className="bg-[var(--mp-custom-white)] border-r border-[var(--mp-custom-gray-200)] overflow-y-auto">
      <div className="space-y-1">
        {names && names.length > 0 ? (
          names.map((chat, index) => {
            const unreadEntry = unread.find(
              (u) => u.senderId === chat.senderId
            );
            const unreadCount = unreadEntry?.count || 0;
            // console.log(chat);
            return (
              <button
                key={chat.senderId}
                onClick={() => {
                  setSelectedChat(index);
                  setShowChatList(false);
                }}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors duration-150 ease-in-out ${
                  selectedChat === index
                    ? isDoc
                      ? "bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100"
                      : "bg-[var(--peer-custom-orange-50)] border-l-4 border-[var(--peer-custom-orange-500)] hover:bg-[var(--peer-custom-orange-100)]"
                    : "hover:bg-[var(--mp-custom-gray-200)]"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center ${
                      isDoc
                        ? "from-blue-500 to-cyan-500"
                        : "from-[var(--peer-custom-orange-500)] to-[var(--peer-custom-pink-500)]"
                    }`}
                  >
                    {!isDoc && chat.img != "" ? (
                      <img
                        src={chat.img}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-medium text-[var(--mp-custom-gray-800)]">
                    {chat.name}
                  </p>
                  <p className="text-sm text-[var(--mp-custom-gray-600)]">
                    Click to view conversation
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-4 text-gray-500">No Chats Available</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
