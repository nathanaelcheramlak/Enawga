import User from '../models/user.model.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

// Search users by username using regex, excluding the current user
export const getUserByUsername = async (req, res) => {
   try {
     const loggedInUserId = req.user._id;
     const { username } = req.params;

     // Validate and escape regex pattern to prevent ReDoS attacks
     if (!username || username.trim().length === 0) {
       return res.status(400).json({ error: 'Username cannot be empty' });
     }

     const regexPattern = escapeRegex(username);

     // Use regex for partial match on username and exclude the logged-in user
     const users = await User.find({
       username: { $regex: regexPattern, $options: 'i' }, // 'i' for case-insensitive search
       _id: { $ne: loggedInUserId }, // Exclude the current user by their _id
     }).select('-password').limit(20); // Limit results to prevent large responses

     if (!users || users.length === 0) {
       return res.status(404).json({ error: 'No users found' });
     }

     return res.status(200).json(users);
   } catch (error) {
     console.error('Error in getUserByUsername controller: ', error.message);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

// Helper function to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Get user by ID or search by username if not a valid ObjectId
export const getUserById = async (req, res) => {
   try {
     const loggedInUserId = req.user._id;
     const { userId } = req.params;

     // Check if userId is a valid MongoDB ObjectId
     const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(userId);

     let user;
     if (isValidObjectId) {
       // Search by ID
       user = await User.findById(userId).select('-password');
     } else {
       // Fallback to username search with regex
       const regexPattern = escapeRegex(userId);
       const users = await User.find({
         username: { $regex: regexPattern, $options: 'i' },
         _id: { $ne: loggedInUserId },
       }).select('-password').limit(20);

       if (users.length > 0) {
         return res.status(200).json(users);
       }
       user = null;
     }

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
