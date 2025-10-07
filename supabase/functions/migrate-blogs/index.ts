import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the JSON file from GitHub
    const response = await fetch(
      'https://raw.githubusercontent.com/GarvishDua/ink-splash-stories/main/public/api/blogs.json'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs.json');
    }

    const data = await response.json();
    const posts = data.posts || [];

    console.log(`Found ${posts.length} posts to migrate`);

    // Transform and insert posts
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      description: post.description || post.excerpt || '',
      excerpt: post.excerpt,
      category: post.category,
      author: post.author || 'Garvish Dua',
      read_time: post.readTime || post.read_time,
      publish_date: post.publishDate || post.publish_date,
      views: post.views || '0',
      tags: post.tags || [],
      featured: post.featured || false,
      thumbnail: post.thumbnail,
      featured_image: post.featuredImage || post.featured_image
    }));

    // Insert all posts (using upsert to avoid duplicates)
    const { data: insertedData, error } = await supabaseClient
      .from('blogs')
      .upsert(transformedPosts, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error inserting posts:', error);
      throw error;
    }

    console.log(`Successfully migrated ${insertedData?.length || 0} posts`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully migrated ${insertedData?.length || 0} blog posts`,
        count: insertedData?.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});