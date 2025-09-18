// import React, { useEffect } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import UserLoadingSkeleton from './UserLoadingSkeleton';
// import NoChatFound from './NoChatFound';
// import { useAuthStore } from '../store/useAuthStore';

// const ChatsList = () => {
//   const { getMyChatPartners, chats, isUserLoading, setSelectedUser } =
//     useChatStore();
//   const { onlineUsers } = useAuthStore();

//   useEffect(() => {
//     getMyChatPartners();
//   }, [getMyChatPartners]);

//   if (isUserLoading) {
//     return (
//       <div className="p-4 bg-slate-900 shadow-lg rounded-xl">
//         <UserLoadingSkeleton />
//       </div>
//     );
//   }

//   if (chats.length === 0) {
//     return <NoChatFound />;
//   }

//   return (
//     <div className="space-y-3 p-2">
//       {chats.map((chat) => (
//         <div
//           key={chat._id}
//           onClick={() => setSelectedUser(chat)}
//           className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl shadow-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
//         >
//           {/* Avatar */}
//           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500">
//             <img
//               src={chat.profilePic || '/hacker.png'}
//               alt={chat.fullName}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Chat Info */}
//           <div className="flex-1">
//             <h4 className="text-slate-200 font-medium truncate">
//               {chat.fullName}
//             </h4>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChatsList;
import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatFound from './NoChatFound';

const ChatsList = () => {
  const { getMyChatPartners, chats, isUserLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUserLoading) {
    return (
      <div className="p-4 bg-slate-900 shadow-lg rounded-xl">
        <UserLoadingSkeleton />
      </div>
    );
  }

  if (chats.length === 0) {
    return <NoChatFound />;
  }

  return (
    <div className="space-y-3 p-2">
      {chats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id); // ✅ check online status

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl shadow-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
          >
            {/* Avatar with online/offline dot */}
            <div className="relative w-12 h-12">
              <img
                src={chat.profilePic || '/hacker.png'}
                alt={chat.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></span>
            </div>

            {/* Chat Info */}
            <div className="flex-1">
              <h4 className="text-slate-200 font-medium truncate">
                {chat.fullName}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatsList;
