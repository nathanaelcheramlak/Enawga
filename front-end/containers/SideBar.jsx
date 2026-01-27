'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, LogOut, Edit3, ChevronLeft } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { sleep } from '@utils/commonFunctions';
import DefaultProfile from '@public/assets/default-profile-image.jpg';

const SideBar = ({ currentUser }) => {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
     const handleOpenSidebar = () => setIsOpen(true);
     const sidebar = document.getElementById('sidebar');
     
     // Check if on mobile on mount
     const checkMobile = () => {
       if (window.innerWidth < 1024) {
         setIsOpen(false);
       }
     };
     
     checkMobile();
     
     sidebar?.addEventListener('openSidebar', handleOpenSidebar);
     window.addEventListener('resize', checkMobile);
     
     return () => {
       sidebar?.removeEventListener('openSidebar', handleOpenSidebar);
       window.removeEventListener('resize', checkMobile);
     };
   }, []);

   const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        console.log('Logout Failed!');
        return;
      }

      sleep(500);
      document.getElementById('loading-body').classList.add('loading-body');
      document
        .getElementById('loading-spinner')
        .classList.add('loading-spinner');
      router.push('/');
      sleep(500);
      document.getElementById('loading-body').classList.remove('loading-body');
      document
        .getElementById('loading-spinner')
        .classList.remove('loading-spinner');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
       id="sidebar"
       className={`z-20 fixed h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col top-0 shadow-2xl transition-all ease-out delay-150 duration-400 border-r border-slate-700 lg:w-[25%] w-full ${
         isOpen ? 'left-0' : '-left-[100%]'
       }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <h3 className="text-white font-semibold transition-all duration-300">
          Profile
        </h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            size="sm"
            variant="ghost"
            className="hidden lg:flex text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-300" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            size="sm"
            variant="ghost"
            className="lg:hidden text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto transition-all duration-300 p-6">
        <Card className="bg-slate-700/50 border-slate-600">
          <div className="space-y-4 p-6">
            <div className="flex justify-center">
              <div className="relative rounded-full overflow-hidden transition-all duration-300 w-20 h-20">
                <Image
                  src={currentUser?.profilePic || DefaultProfile}
                  alt="profile image"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-lg font-semibold text-white">
                  {currentUser.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Username</p>
                <p className="text-lg font-semibold text-white">
                  @{currentUser.username}
                </p>
              </div>

              {currentUser.bio && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Bio</p>
                  <p className="text-sm text-slate-200 line-clamp-3">
                    {currentUser.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Button
          onClick={() => router.push('/edit-profile')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Logout Button */}
      <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur transition-all duration-300 p-6">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
