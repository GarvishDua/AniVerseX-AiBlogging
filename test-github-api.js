// Test script to directly update GitHub and add a blog post
// This simulates what the Vercel function should do

const GITHUB_TOKEN = "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";
const GITHUB_OWNER = 'GarvishDua';
const GITHUB_REPO = 'ink-splash-stories';
const GITHUB_PATH = 'public/api/blogs.json';

async function addBlogPost() {
  try {
    console.log('🔍 Step 1: Fetching current blog data from GitHub...');
    
    // Get current file
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ink-splash-stories'
        }
      }
    );

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('❌ GitHub fetch error:', getResponse.status, errorText);
      return;
    }

    const fileData = await getResponse.json();
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const currentBlogData = JSON.parse(currentContent);
    
    console.log('✅ Current blog data fetched. Posts count:', currentBlogData.posts.length);

    // Create new blog post
    const newPost = {
      id: `post-${Date.now()}`,
      title: "Test Blog Post from Direct GitHub API",
      description: "This is a test post added directly through GitHub API to verify the integration works correctly.",
      content: `# Test Blog Post

This is a test blog post created at ${new Date().toISOString()} to verify that:

1. ✅ GitHub API integration works
2. ✅ Vercel environment variables are configured
3. ✅ Website updates automatically from GitHub
4. ✅ Blog posting workflow is functional

## How it works

When we update the \`public/api/blogs.json\` file in the GitHub repository:

- The website automatically reads from the GitHub raw content
- New blog posts appear immediately 
- No manual deployment needed
- Content is version controlled

This proves our serverless function should work perfectly!`,
      category: "anime",
      readTime: "2 min read",
      publishDate: new Date().toISOString().split('T')[0],
      views: "0",
      tags: ["test", "github-api", "automation"],
      featured: false
    };

    console.log('📝 Step 2: Creating new blog post:', newPost.title);

    // Add to posts array
    const updatedBlogData = {
      ...currentBlogData,
      posts: [newPost, ...currentBlogData.posts]
    };

    // Update category counts
    const categoryCounts = {};
    updatedBlogData.posts.forEach(post => {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });

    updatedBlogData.categories.forEach(category => {
      category.count = categoryCounts[category.name] || 0;
    });

    console.log('📊 Step 3: Updated category counts');

    // Update GitHub
    console.log('🚀 Step 4: Pushing to GitHub...');
    const newContent = Buffer.from(JSON.stringify(updatedBlogData, null, 2)).toString('base64');
    
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ink-splash-stories'
        },
        body: JSON.stringify({
          message: `Add new blog post: ${newPost.title}`,
          content: newContent,
          sha: fileData.sha
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('❌ GitHub update error:', updateResponse.status, errorText);
      return;
    }

    const updateResult = await updateResponse.json();
    console.log('✅ Successfully updated GitHub!');
    console.log('📎 Commit SHA:', updateResult.commit?.sha);
    console.log('🌐 New total posts:', updatedBlogData.posts.length);
    
    console.log('\n🎉 SUCCESS! Blog post added successfully!');
    console.log('🔗 Check your website: https://aniblogs-b98rd5dza-garvishs-projects.vercel.app');
    console.log('📝 New post ID:', newPost.id);

  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
addBlogPost();
