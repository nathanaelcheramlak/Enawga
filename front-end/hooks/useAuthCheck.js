import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * Custom hook to verify JWT token and handle authentication
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback when token is valid (receives user data)
 * @param {Function} options.onFailure - Callback when token is invalid/expired
 * @param {string} options.successRedirect - Route to redirect on success (optional)
 * @param {string} options.failureRedirect - Route to redirect on failure (optional)
 * @returns {Object} Object with isChecking state and user data
 */
export const useAuthCheck = ({
  onSuccess,
  onFailure,
  successRedirect = null,
  failureRedirect = null,
} = {}) => {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify?timestamp=${new Date().getTime()}`,
          {
            withCredentials: true,
          }
        );

        if (!isMounted) return;

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
        if (isMounted) {
          console.error('Auth check error:', error);
          if (onFailure) {
            onFailure();
          }
          if (failureRedirect) {
            router.push(failureRedirect);
          }
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router, onSuccess, onFailure, successRedirect, failureRedirect]);
};

export default useAuthCheck;
