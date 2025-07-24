import { useNavigate } from 'react-router-dom';
import { useViewTracking } from '@/hooks/useViewTracking';
import { ReactNode } from 'react';

interface BlogPostLinkProps {
  postId: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BlogPostLink = ({ postId, children, className = '', onClick }: BlogPostLinkProps) => {
  const navigate = useNavigate();
  const { trackView, isTracking } = useViewTracking();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Execute custom onClick if provided
    onClick?.();
    
    // Track the view in background (don't wait for it)
    trackView(postId).catch(err => {
      console.warn('View tracking failed:', err);
    });
    
    // Navigate immediately for better UX
    navigate(`/blog/${postId}`);
  };

  return (
    <a 
      href={`/blog/${postId}`}
      onClick={handleClick}
      className={`${className} ${isTracking ? 'opacity-90' : ''} transition-opacity cursor-pointer`}
    >
      {children}
    </a>
  );
};

export default BlogPostLink;
