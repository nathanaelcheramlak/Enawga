'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Card } from '@components/ui/card';
import DefaultProfile from '@public/assets/default-profile-image.jpg';

const EditProfile = () => {
  const [info, setInfo] = useState({
    fullName: '',
    username: '',
    bio: '',
    profilePic: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Handler to update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify?timestamp=${new Date().getTime()}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          const data = response.data;
          setInfo(data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/home');
      } finally {
        setPageLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    if (!info.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!info.bio?.trim()) newErrors.bio = 'Bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: info.fullName,
          bio: info.bio,
        }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error:', errorText);
        throw new Error('Failed to update profile');
      }

      await response.json();
      router.push('/home');
    } catch (error) {
      console.error('Error during submit:', error.message);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-center font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/home')}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-600">
              <Image
                src={info.profilePic || DefaultProfile}
                alt="profile picture"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">@{info.username}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Full Name
              </label>
              <Input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={info.fullName || ''}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Bio Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Bio
              </label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself"
                value={info.bio || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => router.push('/home')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-100"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
