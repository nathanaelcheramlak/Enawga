'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { User, Lock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { Alert, AlertDescription } from '@components/ui/alert';
import { useAuthCheck } from '@hooks/useAuthCheck';

const Login = () => {
   const router = useRouter();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(true);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);
   const [isChecking, setIsChecking] = useState(true);

   // Check if user already has a valid JWT token on mount
   useAuthCheck({
     onSuccess: () => setIsChecking(false),
     onFailure: () => setIsChecking(false),
     successRedirect: '/home',
   });

  const handleLogin = async (e) => {
     e?.preventDefault?.();
     
     if (!username || !password) {
       setError('Username and password are required.');
       return;
     }

     setError(null);
     setLoading(true);

     try {
       const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login?rememberMe=${rememberMe}`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ username, password }),
           credentials: 'include',
         },
       );

       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Login failed. Please check your credentials.');
       }

       router.push('/home');
     } catch (error) {
       setError(error.message);
     } finally {
       setLoading(false);
     }
   };

   const handleKeyDown = (e) => {
     if (e.key === 'Enter' && !loading) {
       handleLogin(e);
     }
   };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    } catch (error) {
      setError(error.message);
    }
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white text-center">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border border-slate-700 bg-slate-800 shadow-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center text-white">
            Welcome Back
          </CardTitle>
          <p className="text-center text-slate-400 text-sm">
            Sign in to your account to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-950 border-red-700">
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-slate-600 bg-slate-700"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-slate-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">or</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            disabled={loading}
            className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
