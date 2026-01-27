'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';

const developers = [
  {
    name: 'DanielJohn17',
    fullName: 'Daniel Yohannes',
    github: 'https://github.com/DanielJohn17',
    image: 'https://avatars.githubusercontent.com/u/112425917?v=4',
    color: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-500/50',
  },
  {
    name: 'nathanaelcheramlak',
    fullName: 'Nathanael Cheramlak',
    github: 'https://github.com/nathanaelcheramlak',
    image: 'https://avatars.githubusercontent.com/u/124700160?v=4',
    color: 'from-purple-500 to-purple-600',
    shadowColor: 'shadow-purple-500/50',
  },
  {
    name: 'coleYab',
    fullName: 'Yeabsira Moges',
    github: 'https://github.com/coleYab',
    image: 'https://avatars.githubusercontent.com/u/142606658?v=4',
    color: 'from-emerald-500 to-emerald-600',
    shadowColor: 'shadow-emerald-500/50',
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-4xl text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter py-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent block">
                Welcome to Enawga 
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-slate-300">
              Web Chat App
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with others in real-time. Join chat rooms, share moments, and stay engaged with our modern messaging platform.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <Button
              onClick={() => router.push('/login')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="w-full py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-12">
            Built by passionate developers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <a
                key={dev.name}
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-600/20 cursor-pointer">
                  <div className="p-6 h-full flex items-center gap-4">
                    {/* Profile Image */}
                    <div className={`relative flex-shrink-0 rounded-full overflow-hidden w-16 h-16 ring-2 ring-slate-600 group-hover:ring-slate-500 transition-all`}>
                      <Image
                        src={dev.image}
                        alt={dev.fullName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Developer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {dev.name}
                        </h3>
                        <Github className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-slate-400 truncate">
                        {dev.fullName}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-8 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-slate-500">
            © 2025 Enawga. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
