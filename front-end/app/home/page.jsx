'use client';
import { useState, useEffect, useCallback } from 'react';

import FriendList from '@containers/FriendList';
import ChatBox from '@containers/ChatBox';
import NotificationList from '@containers/NotificationList';
import SideBar from '@containers/SideBar';
import SearchUsers from '@containers/SearchUsers';
import Error from '@containers/ErrorPage';

import { fetchFriends } from '@utils/commonFunctions';
import { useAuthCheck } from '@hooks/useAuthCheck';

const HomePage = () => {
   const [theme, setTheme] = useState('dark');
   const [isBack, setIsBack] = useState(true);
   const [openNoti, setOpenNoti] = useState(false);
   const [currentUser, setCurrentUser] = useState({});
   const [friends, setFriends] = useState([]);
   const [loading, setLoading] = useState(true);
   const [clickedUser, setClickedUser] = useState(null);
   const [unreadMessageList, setunreadMessageList] = useState([]);
   const [unreadCount, setUnreadCount] = useState(0);

    const addNewUnreadMessage = (message) => {
      setunreadMessageList((prevUnreadMsg) => [message, ...prevUnreadMsg]);
      setUnreadCount((prev) => prev + 1);
    };

    // read message
    const removeUnreadMessage = (message) => {
      setunreadMessageList((prevUnreadMsg) =>
        prevUnreadMsg.filter((p) => p?._id !== message?._id),
      );
    };

    // Check if user has valid JWT token on mount
    const handleAuthSuccess = useCallback((user) => {
      setCurrentUser(user);
      setLoading(false);
    }, []);

    const handleAuthFailure = useCallback(() => {
      setLoading(false);
    }, []);

    useAuthCheck({
      onSuccess: handleAuthSuccess,
      onFailure: handleAuthFailure,
      failureRedirect: '/login',
    });

  useEffect(() => {
    fetchFriends(setFriends);
  }, []);

  const handleMessageClick = async (user) => {
    setClickedUser(user);
    handleNotification();
  };

  const changeTheme = () => {
    document.body.classList.toggle('light');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeBack = () => {
    setIsBack((prev) => !prev);
  };

  const handleNotification = () => {
    setOpenNoti((prev) => !prev);
    if (openNoti) {
      setUnreadCount(0);
    }
  };

  const handleClickedUser = (user) => {
    setClickedUser(user);
  };

  const handleError = () => {
    router.push('/');
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-white text-center font-medium">Loading your messages...</p>
          </div>
        </div>
      ) : !currentUser ? (
        <>
          <Error message="User data not found." handleError={handleError} />
        </>
      ) : (
        <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex overflow-hidden">
           <SideBar currentUser={currentUser} />
           <SearchUsers setFriends={setFriends} />

           {openNoti && (
             <NotificationList
               handleMessageClick={handleMessageClick}
               handleNotification={handleNotification}
             />
           )}

           <div className="hidden lg:flex flex-1 h-screen z-0 gap-0 min-w-0">
             <FriendList
               friends={friends}
               theme={theme}
               handleClickedUser={handleClickedUser}
               changeTheme={changeTheme}
               handleNotification={handleNotification}
               currentUser={currentUser}
               unreadCount={unreadCount}
             />
             <ChatBox
               currentUser={currentUser}
               unreadMessagesHandler={addNewUnreadMessage}
               clickedUser={clickedUser}
             />
           </div>

          <div className="lg:hidden flex w-full h-full relative">
            {isBack ? (
              <FriendList
                friends={friends}
                theme={theme}
                handleClickedUser={handleClickedUser}
                changeTheme={changeTheme}
                handleNotification={handleNotification}
                currentUser={currentUser}
                changeBack={changeBack}
                unreadCount={unreadCount}
              />
            ) : (
              <ChatBox
                changeBack={changeBack}
                currentUser={currentUser}
                unreadMessagesHandler={addNewUnreadMessage}
                clickedUser={clickedUser}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
