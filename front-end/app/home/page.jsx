import { Suspense } from 'react';
import HomeContent from './HomeContent';

const HomePage = () => {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-white text-center font-medium">Loading your messages...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
};

export default HomePage;
