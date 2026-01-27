'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Alert, AlertDescription } from '@components/ui/alert';
import { saveToken, getAuthHeader } from '@utils/tokenManager';

const Signup = () => {
  const [info, setInfo] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Check if user already has a valid JWT token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?timestamp=${new Date().getTime()}`,
          {
            headers: getAuthHeader(),
          }
        );

        if (response.status === 200) {
          // User is already authenticated, redirect to home
          router.push('/home');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handler to update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};
    if (!info.fullName) newErrors.fullName = 'Full Name is required';
    if (!info.email) newErrors.email = 'Email is required';
    if (!info.username) newErrors.username = 'Username is required';
    if (!info.password) newErrors.password = 'Password is required';
    if (info.password !== info.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: info.fullName,
          username: info.username,
          email: info.email,
          password: info.password,
          confirmPassword: info.confirmPassword,
        }),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Signup failed. Something went wrong.');
      }
      const data = await response.json();
      if (response.ok && data.token) {
        saveToken(data.token);
        router.push('/home');
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error while signup: ", error);
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
            Create Account
          </CardTitle>
          <p className="text-center text-slate-400 text-sm">
            Join Enawga and start chatting today
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={info.fullName}
                  onChange={handleChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={info.email}
                  onChange={handleChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={info.username}
                  onChange={handleChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-400 mt-1">{errors.username}</p>
              )}
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
                  name="password"
                  placeholder="Create a password"
                  value={info.password}
                  onChange={handleChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={info.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Sign Up Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
