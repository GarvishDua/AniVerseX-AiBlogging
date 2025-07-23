import { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback blog data when GitHub is not available
const fallbackBlogData = {
  posts: [
    {
      id: "f161dad5-9682-4404-94f2-a7db84219468",
      title: "The Heart of Home: Top 10 Decoration Essentials for Indian Households",
      description: "Step into an Indian home, and you don't just enter a space; you enter a story. Every corner, every piece of furniture, and especially every carefully chosen item of decoration tells a tale of...",
      content: "Step into an Indian home, and you don't just enter a space; you enter a story. Every corner, every piece of furniture, and especially every carefully chosen item of decoration tells a tale of tradition, warmth, and vibrant life. Indian homes are renowned for their unique blend of cultural richness and comfort, and achieving that signature interior aesthetic often boils down to a few key pieces.\n\nWhether you're looking to infuse a touch of Indian charm into your modern space or simply appreciate the beauty of traditional home decoration, understanding these essentials is key. From intricate carvings to vibrant textiles, these items are more than just decor; they are pieces of art, history, and heart.\n\nLet's dive into the top 10 decoration items you'll almost always find gracing the interiors of Indian households, making them truly special.\n\n**1. The Ever-Graceful Urli with Floating Flowers**\n\nA timeless classic, the urli, often made of brass or copper, is a shallow bowl used to display floating flowers (typically marigolds and roses) and tea-lights. Placed at the entrance, in a living room, or even a prayer room, it instantly adds a touch of serenity and traditional elegance to any interior. It's a simple yet profound statement of welcome and beauty.",
      category: "Anime Reviews",
      readTime: "4 min read",
      publishDate: "Jul 23, 2025",
      views: "16.6K",
      tags: ["welcome", "anime", "blog"],
      featured: true,
      slug: "the-heart-of-home-top-10-decoration-essentials-for-indian-households",
      excerpt: "Step into an Indian home, and you don't just enter a space; you enter a story..."
    },
    {
      id: "1",
      title: "One Piece Chapter 1100: The Revolutionary Reveal",
      description: "Oda delivers another shocking twist in the latest chapter. Dive deep into the implications of this revelation and what it means for the Straw Hat crew's future adventures.",
      category: "Manga",
      readTime: "6 min read",
      publishDate: "Dec 20, 2024",
      views: "8.2K",
      tags: ["One Piece", "Manga", "Chapter Review", "Oda"],
      content: "The latest chapter of One Piece continues to push boundaries with Oda's masterful storytelling. In Chapter 1100, we witness a revelation that changes everything we thought we knew about the Revolutionary Army and their connection to the World Government.",
      featured: true
    },
    {
      id: "2",
      title: "Attack on Titan Final Season: A Masterclass in Storytelling",
      description: "An in-depth analysis of how Hajime Isayama crafted one of the most compelling endings in anime history, exploring themes of freedom, cycles of hatred, and human nature.",
      category: "Anime Reviews",
      readTime: "12 min read",
      publishDate: "Dec 19, 2024",
      views: "15.7K",
      tags: ["Attack on Titan", "Review", "Analysis", "Isayama"],
      content: "Attack on Titan's conclusion represents a pinnacle of narrative achievement in modern anime. Hajime Isayama's decade-long journey culminated in a finale that divided fans but undeniably showcased sophisticated storytelling techniques.",
      featured: false
    }
  ],
  categories: [
    { name: "Anime Reviews", count: 2, color: "primary" },
    { name: "Manga", count: 1, color: "accent" },
    { name: "Marvel & Comics", count: 0, color: "secondary" },
    { name: "Fan Theories & Explained", count: 0, color: "accent" }
  ]
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log(`Fallback API Request: ${req.method} ${req.url}`);

    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // Get specific blog post
          const post = fallbackBlogData.posts.find(p => p.id === req.query.id);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          return res.status(200).json(post);
        } else {
          // Get all blogs
          return res.status(200).json(fallbackBlogData);
        }

      case 'POST':
        // Add new blog post (in memory only for fallback)
        const newPost = req.body;
        
        if (!newPost.title || !newPost.content) {
          return res.status(400).json({ error: 'Title and content are required' });
        }

        // Generate ID if not provided
        if (!newPost.id) {
          newPost.id = Date.now().toString();
        }

        // Add timestamp
        newPost.publishDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        return res.status(201).json({ 
          message: 'Post created successfully (fallback mode - not persisted)', 
          post: newPost 
        });

      case 'DELETE':
        return res.status(200).json({ 
          message: 'Post deleted successfully (fallback mode)' 
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Fallback API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
