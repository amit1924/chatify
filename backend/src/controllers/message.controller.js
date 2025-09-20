import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

// =========================================================
// Get all contacts
// =========================================================
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

// =========================================================
// Get chat partners (users you have messaged with)
// =========================================================
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

// =========================================================
// Get messages with a user (and mark them as seen)
// =========================================================
// export const getMessagesByUserId = async (req, res) => {
//   try {
//     const myId = req.user._id;
//     const { id: otherUserId } = req.params;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: myId },
//       ],
//     }).sort({ createdAt: 1 });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    })
      .populate('replyTo', 'text image senderId') // ✅ populate reply
      .sort({ createdAt: 1 });

    // ✅ Mark messages as seen
    await Message.updateMany(
      { receiverId: myId, senderId: otherUserId, seenBy: { $ne: myId } },
      { $push: { seenBy: myId } },
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// Send a message (supports replies)
// =========================================================
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const senderId = req.user._id;
//     const { id: receiverId } = req.params;

//     if (!text && !image) {
//       return res.status(400).json({ message: 'Message cannot be empty' });
//     }

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

//     // Emit message to receiver in real-time
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('newMessage', newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
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
      replyTo: replyTo || null, // ✅ reply support
      deliveredTo: [receiverId], // ✅ mark as delivered initially
    });

    await newMessage.save();

    // ✅ populate reply message for frontend
    await newMessage.populate('replyTo', 'text image senderId');

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

// =========================================================
// Edit an existing message
// =========================================================
export const editMessage = async (req, res) => {
  try {
    const { id } = req.params; // message ID
    const { text } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not allowed to edit this message' });
    }

    message.text = text;
    await message.save();

    // Emit update to receiver
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageEdited', message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// =========================================================
// Delete a message
// =========================================================
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not allowed to delete this message' });
    }

    await message.deleteOne();

    // Emit delete event
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageDeleted', { _id: id });
    }

    res.status(200).json({ message: 'Message deleted successfully', id });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// =========================================================
// Mark a single message as seen (✓✓ read receipt)
// =========================================================
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params; // messageId
    const userId = req.user._id;

    const message = await Message.findByIdAndUpdate(
      id,
      { $addToSet: { seenBy: userId } }, // prevents duplicates
      { new: true },
    );

    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Emit real-time read receipt
    const senderSocketId = getReceiverSocketId(message.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('messageSeen', {
        messageId: id,
        seenBy: userId,
      });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error('Error marking message as seen:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
