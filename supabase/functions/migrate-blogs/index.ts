import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Fetching blogs.json from GitHub...')
    
    const response = await fetch(
      'https://raw.githubusercontent.com/GarvishDua/ink-splash-stories/main/public/api/blogs.json'
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs.json: ${response.status}`)
    }

    const blogData = await response.json()
    const posts = blogData.posts || []

    console.log(`Found ${posts.length} posts to migrate`)

    let inserted = 0
    let errors = 0

    for (const post of posts) {
      const blogPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        description: post.description || post.excerpt || '',
        excerpt: post.excerpt,
        category: post.category,
        author: post.author || 'Garvish Dua',
        read_time: post.readTime,
        publish_date: post.publishDate,
        views: post.views || '0',
        tags: post.tags || [],
        featured: post.featured || false,
        thumbnail: post.thumbnail || '',
        featured_image: post.featuredImage || ''
      }

      const { error } = await supabase
        .from('blogs')
        .upsert(blogPost, { onConflict: 'id' })

      if (error) {
        console.error(`Error inserting post ${post.id}:`, error)
        errors++
      } else {
        inserted++
        console.log(`Inserted/updated post: ${post.title}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Migration complete: ${inserted} posts inserted/updated, ${errors} errors`,
        stats: { inserted, errors, total: posts.length }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Migration error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
