import React, { useState } from 'react';
import { useBlogData } from '@/hooks/useBlogData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';

interface NewPost {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  readTime: string;
}

export const AdminPanel: React.FC = () => {
  const { blogData, loading, createPost, deletePost } = useBlogData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    description: '',
    content: '',
    category: 'Anime Reviews',
    tags: '',
    readTime: '5 min read'
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim())
      });
      setNewPost({
        title: '',
        description: '',
        content: '',
        category: 'Anime Reviews',
        tags: '',
        readTime: '5 min read'
      });
      setShowCreateForm(false);
      alert('Post created successfully!');
    } catch (error) {
      alert('Failed to create post: ' + error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        alert('Post deleted successfully!');
      } catch (error) {
        alert('Failed to delete post: ' + error);
      }
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Admin Panel</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>Fill in the details below to create a new blog post</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <Input
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              <Input
                placeholder="Short Description"
                value={newPost.description}
                onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                required
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                {blogData?.categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <Input
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              />
              <Input
                placeholder="Read Time (e.g., 5 min read)"
                value={newPost.readTime}
                onChange={(e) => setNewPost(prev => ({ ...prev, readTime: e.target.value }))}
                required
              />
              <Textarea
                placeholder="Write your blog content here..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                required
              />
              <div className="flex gap-2">
                <Button type="submit">Create Post</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold">Existing Posts ({blogData?.posts.length || 0})</h2>
        {blogData?.posts.map(post => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-2">{post.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    {post.readTime && <Badge variant="outline">{post.readTime}</Badge>}
                    {post.publishDate && <Badge variant="outline">{post.publishDate}</Badge>}
                    {post.views && <Badge variant="outline">{post.views} views</Badge>}
                    {post.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
