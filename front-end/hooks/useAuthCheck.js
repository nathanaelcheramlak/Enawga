import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getAuthHeader } from '@utils/tokenManager';

/**
 * Custom hook to verify JWT token and handle authentication
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback when token is valid (receives user data)
 * @param {Function} options.onFailure - Callback when token is invalid/expired
 * @param {string} options.successRedirect - Route to redirect on success (optional)
 * @param {string} options.failureRedirect - Route to redirect on failure (optional)
 * @param {boolean} options.enabled - Whether to run the auth check (default: true)
 * @returns {Object} Object with isChecking state and user data
 */
export const useAuthCheck = ({
  onSuccess,
  onFailure,
  successRedirect = null,
  failureRedirect = null,
  enabled = true,
} = {}) => {
  const router = useRouter();

  const verifyAuth = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
        {
          headers: getAuthHeader(),
        }
      );

      if (response.status === 200 && response.data.user) {
        // Token is valid
        if (onSuccess) {
          onSuccess(response.data.user);
        }
        if (successRedirect) {
          router.push(successRedirect);
        }
      } else {
        // Token invalid or no user data
        if (onFailure) {
          onFailure();
        }
        if (failureRedirect) {
          router.push(failureRedirect);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (onFailure) {
        onFailure();
      }
      if (failureRedirect) {
        router.push(failureRedirect);
      }
    }
  }, [onSuccess, onFailure, successRedirect, failureRedirect, router]);

  useEffect(() => {
    if (!enabled) return;

    verifyAuth();
  }, [enabled, verifyAuth]);
};

export default useAuthCheck;
