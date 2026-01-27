'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

import ProfileCard from '@components/ProfileCard';
import ChatBubble from '@components/ChatBubble';
import InputCard from '@components/InputCard';

import { initializeSocket, disconnectSocket } from '../utils/socket.js';

const ChatBox = ({
  changeBack,
  currentUser,
  unreadMessagesHandler = () => {},
  clickedUser,
}) => {
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [textValue, setTextValue] = useState('');
  const socket = useRef(initializeSocket(currentUser?._id));

  const handleChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!clickedUser) return;

    const theTextValue = textValue;
    setTextValue('');

    // sorry but we are not allowing users to send empty messages
    if (theTextValue.trim() === '') {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/send/${clickedUser._id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message_content: theTextValue,
          }),
        },
      );

      if (!response.ok) {
        console.log('Failed to send new message');
        return;
      }

      const sentMessage = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...sentMessage, message: theTextValue, session: true },
      ]);
    } catch (error) {
      console.log('Error sending new message: ', error);
    }
  };

  // Hook1: connect the user when the component is fully loaded
  useEffect(() => {
    const currentSocket = socket.current;

    currentSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    currentSocket.on('newIncomingMessage', (message) => {
      console.log('Received message:', message, 'Current user ID:', currentUser?._id, 'Clicked user ID:', clickedUser?._id);
      
      // Add message if it's from the currently chatting user
      if (clickedUser && message.senderId === clickedUser._id) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, message: message?.message_content, session: false },
        ]);
      }
      
      // Mark as unread if user is not chatting with this sender
      if (!clickedUser || message.senderId !== clickedUser._id) {
        unreadMessagesHandler(message);
      }
    });

    return () => {
      currentSocket.off('newIncomingMessage');
    };
  }, [clickedUser, currentUser, unreadMessagesHandler]);

  // Hook2: load the previous chat histroy whenever the clicked user is changed
  useEffect(() => {
    if (clickedUser) {
      // Helper: load all the coversation from the db
      const fetchConverstaion = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages/user/${clickedUser._id}`,
            {
              credentials: 'include',
            },
          );

          if (!response.ok) {
            console.log('Failed to fetch previous messages:', response.status);
            return;
          }

          const previousMessages = await response.json();

          previousMessages.forEach((message) => {
            (message.message = message.message_content),
              (message.session = message.receiverId === clickedUser._id);
          });

          setMessages(previousMessages);
        } catch (err) {
          console.log('Error while fetching previous messages:', err);
        }
      };

      fetchConverstaion();
    }
  }, [clickedUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [messages]);

  return (
    <div className="flex-[0.75] justify-between relative flex flex-col bg-slate-900 h-full min-w-0">
      {clickedUser ? (
        <>
          {/* Header */}
          <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {changeBack && (
                  <button
                    onClick={changeBack}
                    className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                  </button>
                )}
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {clickedUser.username}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {clickedUser.bio || 'No bio'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-6" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  message={msg.message}
                  createdAt={msg.createdAt}
                  session={msg.session}
                />
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur p-4">
            <div className="flex gap-3 items-end">
              <Input
                placeholder="Type a message..."
                value={textValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <MessageCircle className="h-20 w-20 mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2">No chat selected</h2>
          <p className="text-sm">Select a user from your friends list to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
