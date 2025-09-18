// import Message from '../models/Message.js';
// import User from '../models/User.js';
// import cloudinary from '../lib/cloudinary.js';
// import { getReceiverSocketId } from '../lib/socket.js';
// // Get all contacts
// export const getAllContacts = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     console.log(`loggedInUserId: ${loggedInUserId}`);
//     const filteredUsers = await User.find({
//       _id: { $ne: loggedInUserId },
//     }).select('-password');

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const getMessagesByUserId = async (req, res) => {
//   try {
//     const myId = req.user._id;
//     const { id: userToChatId } = req.params;
//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     });
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const senderId = req.user._id;
//     const { id: receiverId } = req.params;
//     let imageUrl;
//     if (image) {
//       const uploadResponse = await cloudinary.uploader.upload(image);
//       imageUrl = uploadResponse.secure_url;
//     }

//     const newMessage = new Message({
//       text,
//       image: imageUrl,
//       senderId,
//       receiverId,
//     });

//     await newMessage.save();

//     //send message in realtime using socket.io
//     const receiverSocketId = getReceiverSocketId(receiverId);

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('newMessage', newMessage);
//     }
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const getChatPartners = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     // find all the messages where the logged-in user is either sender or receiver
//     const messages = await Message.find({
//       $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
//     });

//     const chatPartnerIds = [
//       ...new Set(
//         messages.map((msg) =>
//           msg.senderId.toString() === loggedInUserId.toString()
//             ? msg.receiverId.toString()
//             : msg.senderId.toString(),
//         ),
//       ),
//     ];

//     const chatPartners = await User.find({
//       _id: { $in: chatPartnerIds },
//     }).select('-password');

//     res.status(200).json(chatPartners);
//   } catch (error) {
//     console.error('Error in getChatPartners: ', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      '-password',
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get chat partners
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const partnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const partners = await User.find({ _id: { $in: partnerIds } }).select(
      '-password',
    );
    res.status(200).json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages with a user
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (!text && !image) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      text,
      image: imageUrl,
      senderId,
      receiverId,
    });

    await newMessage.save();

    // Emit message to receiver in real-time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
