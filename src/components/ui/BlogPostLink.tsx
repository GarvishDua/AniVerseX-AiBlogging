import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface BlogPostLinkProps {
  postId: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BlogPostLink = ({ postId, children, className = '', onClick }: BlogPostLinkProps) => {
  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Execute custom onClick if provided
    onClick?.();
    
    // Navigate to the blog post
    navigate(`/blog/${postId}`);
  };

  return (
    <a 
      href={`/blog/${postId}`}
      onClick={handleClick}
      className={`${className} transition-opacity cursor-pointer`}
    >
      {children}
    </a>
  );
};

export default BlogPostLink;
