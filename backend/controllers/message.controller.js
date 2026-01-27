import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { io as socket, getSocketIdFromUserId } from '../utils/socket.js'

export const sendMessage = async (req, res) => {
   try {
     const { message_content } = req.body;
     const { id: receiverId } = req.params; // Receiver's id
     const senderId = req.user._id;

     let conversation = await Conversation.findOne({
       members: { $all: [senderId, receiverId] },
     });

     if (!conversation) {
       conversation = await Conversation.create({
         members: [senderId, receiverId],
       });
     }

     const newMessage = await Message.create({
       senderId,
       receiverId,
       message_content,
       isRead: false,
     });

     if (newMessage) {
       conversation.messages.push(newMessage._id);
     }

     const reciverSid = getSocketIdFromUserId(receiverId);
     if (reciverSid) {
         socket.to(reciverSid).emit('newIncomingMessage', newMessage);
     }

     await Promise.all([conversation.save(), newMessage.save()]);

     res.status(201).json(newMessage);
   } catch (error) {
     console.error('Error in sendMessage controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};


export const deleteTheConversation = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  // Validate input
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'senderId and receiverId are required' });
  }

  try {
    const result = await Message.deleteMany({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    await Conversation.deleteOne({
      message: [ senderId, reciverId ]
    });

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: 'Conversation deleted successfully' });
    } else {
      return res.status(404).json({ message: 'No conversation found between the specified users' });
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the conversation' });
  }
}

export const getMessages = async (req, res) => {
   try {
     const { id: receiverId } = req.params; // Receiver's id
     const senderId = req.user._id;

     const conversation = await Conversation.findOne({
       members: { $all: [senderId, receiverId] },
     }).populate('messages'); // populates with the objects instead of message ids.

     if (!conversation) {
       return res.status(200).json([]);
     }
     res.status(200).json(conversation.messages);
   } catch (error) {
     console.error('Error in getMessages controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

export const getUnreadMessages = async (req, res) => {
   try {
     const userId = req.user._id;

     const unreadMessages = await Message.find({
       receiverId: userId,
       isRead: false,
     }).populate('senderId', 'username fullName profilePic bio');

     res.status(200).json(unreadMessages);
   } catch (error) {
     console.error('Error in getUnreadMessages controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

export const markMessagesAsRead = async (req, res) => {
   try {
     const { senderId } = req.body;
     const userId = req.user._id;

     await Message.updateMany(
       {
         senderId,
         receiverId: userId,
         isRead: false,
       },
       { isRead: true },
     );

     res.status(200).json({ message: 'Messages marked as read' });
   } catch (error) {
     console.error('Error in markMessagesAsRead controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

export const getMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;

    const message = await Message.find({ _id: messageId });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.error('Error in getMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;

    // Find the message by ID and delete it
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Send success response
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { message_content } = req.body;

    // Check if message content is provided
    if (!message_content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await Message.findOne({ _id: messageId });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Find the message by ID and update it
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { message_content },
      { new: true },
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Send success response
    res
      .status(200)
      .json({ message: 'Message updated successfully', updatedMessage });
  } catch (error) {
    console.error('Error in updateMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
