import { useCallback, useState, useEffect } from 'react';

interface ViewTrackingOptions {
  onSuccess?: (newViewCount: string) => void;
  onError?: (error: string) => void;
}

export const useViewTracking = (options: ViewTrackingOptions = {}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackView = useCallback(async (postId: string) => {
    if (isTracking) return; // Prevent multiple calls

    setIsTracking(true);
    setError(null);

    try {
      const response = await fetch('/api/increment-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ View tracked for post: ${result.postTitle} - ${result.newViewCount} views`);
        options.onSuccess?.(result.newViewCount);
      } else {
        const errorMsg = result.message || 'Failed to track view';
        setError(errorMsg);
        options.onError?.(errorMsg);
        console.error('❌ View tracking failed:', errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error';
      setError(errorMsg);
      options.onError?.(errorMsg);
      console.error('❌ View tracking error:', error);
    } finally {
      setIsTracking(false);
    }
  }, [isTracking, options]);

  const reset = useCallback(() => {
    setError(null);
    setIsTracking(false);
  }, []);

  return {
    trackView,
    isTracking,
    error,
    reset
  };
};

// Hook for automatic view tracking on component mount
export const useAutoViewTracking = (postId: string | undefined, options: ViewTrackingOptions = {}) => {
  const { trackView, isTracking, error } = useViewTracking(options);
  const [hasTracked, setHasTracked] = useState(false);

  const trackOnMount = useCallback(() => {
    if (postId && !hasTracked && !isTracking) {
      trackView(postId);
      setHasTracked(true);
    }
  }, [postId, hasTracked, isTracking, trackView]);

  return {
    trackOnMount,
    trackView,
    isTracking,
    error,
    hasTracked
  };
};
