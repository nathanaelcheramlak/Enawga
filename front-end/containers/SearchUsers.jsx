import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, MessageSquare, UserX } from 'lucide-react';

import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { fetchFriends } from '@utils/commonFunctions';
import DefaultProfile from '@public/assets/default-profile-image.jpg';

const SearchUsers = ({ setFriends }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
         const { getAuthHeader } = await import('@utils/tokenManager');
         const response = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/api/search/user/${search}`,
           {
             headers: getAuthHeader(),
           },
         );

        if (!response.ok) {
          console.log('Failed to fetch users');
          return;
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log('Error fetching users: ', error);
      }
    };

    if (search.length > 0) {
      fetchUsers();
    }
  }, [search]);

  const handleMessageClick = async (user) => {
    try {
      document.getElementById('loading-body').classList.add('loading-body');
      document
        .getElementById('loading-spinner')
        .classList.add('loading-spinner');
      const { getAuthHeader } = await import('@utils/tokenManager');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/send/${user._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            message_content: 'You have started chatting.',
          }),
        },
      );

      if (!response.ok) {
        console.log('Failed to send new message');
        return;
      }
      setSearch('');
      await fetchFriends(setFriends);
      document.getElementById('loading-body').classList.remove('loading-body');
      document
        .getElementById('loading-spinner')
        .classList.remove('loading-spinner');

      document
        .getElementById('search_container')
        .classList.replace('fixed', 'hidden');
      router.reload();
    } catch (error) {
      console.log('Error sending new message: ', error);
    }
  };

  return (
    <div
      id="search_container"
      className="hidden fixed inset-0 z-20 bg-black/60 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl h-[85vh] rounded-lg bg-slate-800 border border-slate-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 h-10"
                autoFocus
              />
            </div>
            <Button
              onClick={() => {
                document
                  .getElementById('search_container')
                  .classList.replace('fixed', 'hidden');
              }}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {search.length > 0 ? (
          <ul className="flex-1 overflow-y-auto">
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <li
                  key={index}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={user.profilePic || DefaultProfile}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {user.username}
                        </h3>
                        <p className="text-sm text-slate-400 truncate">
                          {user.fullName}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleMessageClick(user)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 ml-4"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <UserX className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try searching with a different name</p>
              </div>
            )}
          </ul>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Search className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Start searching</p>
            <p className="text-sm">Search for users to start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
