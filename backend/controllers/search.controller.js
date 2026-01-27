import User from '../models/user.model.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

// Search users by partial username, excluding the current user
export const getUserByUsername = async (req, res) => {
   try {
     const loggedInUserId = req.user._id;
     const { username } = req.params;

     // Use regex for partial match on username and exclude the logged-in user
     const users = await User.find({
       username: { $regex: username, $options: 'i' }, // 'i' for case-insensitive search
       _id: { $ne: loggedInUserId }, // Exclude the current user by their _id
     }).select('-password');

     if (!users || users.length === 0) {
       return res.status(404).json({ error: 'No users found' });
     }

     return res.status(200).json(users);
   } catch (error) {
     console.error('Error in getUserByUsername controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

// Get user by ID
export const getUserById = async (req, res) => {
   try {
     const { userId } = req.params;

     const user = await User.findById(userId).select('-password');

     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }

     return res.status(200).json(user);
   } catch (error) {
     console.error('Error in getUserById controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

// Search messages by keyword.
export const getMessageByKeyword = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const senderId = req.params.id;
    const { keyword } = req.query; // Assume the keyword is passed as a query parameter

    // Find the conversation between the two users
    const conversation = await Conversation.findOne({
      members: { $all: [receiverId, senderId] },
    }).populate({
      path: 'messages',
      match: { message_content: { $regex: keyword, $options: 'i' } }, // Filter messages by keyword
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const matchingMessages = conversation.messages;

    res.status(200).json(matchingMessages);
  } catch (error) {
    console.error('Error in getMessageByKeyword controller: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
