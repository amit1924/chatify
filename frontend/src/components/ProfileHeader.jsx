// import { useState, useRef } from 'react';
// import { LogOut, VolumeX, Volume2 } from 'lucide-react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';

// const mouseClickSound = new Audio('/sounds/mouse-click.mp3');

// function ProfileHeader() {
//   const { logout, authUser, updateProfile } = useAuthStore();
//   const { isSoundEnabled, toggleSound } = useChatStore();
//   const [selectedImg, setSelectedImg] = useState(null);

//   const fileInputRef = useRef(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = async () => {
//       const base64Image = reader.result;
//       setSelectedImg(base64Image);
//       await updateProfile({ profilePic: base64Image });
//     };
//   };

//   return (
//     <div className="flex items-center justify-between p-3 bg-white shadow rounded-md">
//       {/* Left: Avatar + Name */}
//       <div className="flex items-center gap-3">
//         {/* Avatar */}
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => fileInputRef.current.click()}
//             className="relative"
//           >
//             <img
//               src={selectedImg || authUser.profilePic || '/avatar.png'}
//               alt="User avatar"
//               className="w-12 h-12 rounded-full object-cover border"
//             />
//             <div className="absolute bottom-0 right-0 bg-cyan-500 text-white text-xs rounded px-1">
//               Change
//             </div>
//           </button>
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//         </div>

//         {/* Name & status */}
//         <div>
//           <h3 className="font-semibold text-slate-800">{authUser.fullName}</h3>
//           <p className="text-sm text-green-600">Online</p>
//         </div>
//       </div>

//       {/* Right: Buttons */}
//       <div className="flex items-center gap-3">
//         {/* Logout */}
//         <button
//           type="button"
//           onClick={logout}
//           className="p-2 rounded hover:bg-slate-100"
//         >
//           <LogOut className="w-5 h-5 text-red-500" />
//         </button>

//         {/* Sound toggle */}
//         <button
//           type="button"
//           onClick={() => {
//             mouseClickSound.currentTime = 0;
//             mouseClickSound
//               .play()
//               .catch((error) => console.log('Audio play failed:', error));
//             toggleSound();
//           }}
//           className="p-2 rounded hover:bg-slate-100"
//         >
//           {isSoundEnabled ? (
//             <Volume2 className="w-5 h-5 text-cyan-600" />
//           ) : (
//             <VolumeX className="w-5 h-5 text-slate-400" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProfileHeader;

import { useState, useRef } from 'react';
import { LogOut, VolumeX, Volume2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const mouseClickSound = new Audio('/sounds/mouse-click.mp3');

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 shadow-md rounded-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="relative"
          >
            <img
              src={selectedImg || authUser.profilePic || '/avatar.png'}
              alt="User avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div className="absolute bottom-0 right-0 bg-cyan-500 text-white text-xs rounded px-1">
              Change
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div>
          <h3 className="font-semibold text-white">{authUser.fullName}</h3>
          <p className="text-sm text-green-600">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded hover:bg-slate-100"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>

        <button
          type="button"
          onClick={() => {
            mouseClickSound.currentTime = 0;
            mouseClickSound.play().catch((error) => console.log(error));
            toggleSound();
          }}
          className="p-2 rounded hover:bg-slate-100"
        >
          {isSoundEnabled ? (
            <Volume2 className="w-5 h-5 text-cyan-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
