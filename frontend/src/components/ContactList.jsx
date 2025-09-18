// import React, { useEffect } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import UserLoadingSkeleton from './UserLoadingSkeleton';
// import NoChatFound from './NoChatFound';

// const ContactList = () => {
//   const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
//     useChatStore();

//   useEffect(() => {
//     getAllContacts();
//   }, [getAllContacts]);

//   if (isUsersLoading) {
//     // Show loading skeleton while fetching contacts
//     return (
//       <div className="p-4 bg-slate-900 rounded-xl shadow-lg">
//         <UserLoadingSkeleton />
//       </div>
//     );
//   }

//   if (allContacts.length === 0) {
//     // Show empty state if no contacts found
//     return <NoChatFound message="No contacts found 😢" />;
//   }

//   return (
//     <div className="space-y-3 p-2">
//       {allContacts.map((user) => (
//         <div
//           key={user._id}
//           onClick={() => setSelectedUser(user)}
//           className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl shadow-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
//         >
//           {/* Avatar */}
//           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500">
//             <img
//               src={user.profilePic || '/avatar.png'}
//               alt={user.fullName}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Contact Info */}
//           <div className="flex-1">
//             <h4 className="text-slate-200 font-medium truncate">
//               {user.fullName}
//             </h4>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ContactList;

import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatFound from './NoChatFound';

const ContactList = () => {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore(); // 👈 from auth store

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) {
    return (
      <div className="p-4 bg-slate-900 rounded-xl shadow-lg">
        <UserLoadingSkeleton />
      </div>
    );
  }

  if (allContacts.length === 0) {
    return <NoChatFound message="No contacts found 😢" />;
  }

  return (
    <div className="space-y-3 p-2">
      {allContacts.map((user) => {
        const isOnline = onlineUsers.includes(user._id); // ✅ check status

        return (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl shadow-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
          >
            {/* Avatar with online/offline dot */}
            <div className="relative w-12 h-12">
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></span>
            </div>

            {/* Contact Info */}
            <div className="flex-1">
              <h4 className="text-slate-200 font-medium truncate">
                {user.fullName}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
