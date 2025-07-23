// Complete n8n GitHub API Integration Example
// This simulates exactly what your n8n workflow will do

const GITHUB_TOKEN = "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";
const GITHUB_OWNER = "GarvishDua";
const GITHUB_REPO = "ink-splash-stories";
const GITHUB_PATH = "public/api/blogs.json";

// Simulate incoming blog post data (this is what n8n will receive)
const incomingBlogData = {
  title: "Complete n8n Integration Test",
  content: "This blog post was created using the exact same process that n8n will use. It demonstrates the complete workflow: fetching current data from GitHub, adding the new post, updating category counts, and pushing back to GitHub. The website will automatically reflect this change within seconds!",
  description: "Testing the complete n8n to GitHub API workflow",
  category: "anime",
  tags: ["n8n", "github-api", "automation", "test"],
  featured: false
};

async function n8nGitHubWorkflow() {
  console.log("🚀 Starting n8n GitHub API Workflow...");
  console.log("📝 Blog Data:", incomingBlogData);

  try {
    // STEP 1: Get current blog data from GitHub (n8n HTTP Request Node 1)
    console.log("\n📥 STEP 1: Fetching current blog data from GitHub...");
    
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ink-splash-stories-n8n'
        }
      }
    );

    if (!getResponse.ok) {
      throw new Error(`GitHub fetch failed: ${getResponse.status} ${await getResponse.text()}`);
    }

    const githubResponse = await getResponse.json();
    console.log(`✅ Current file SHA: ${githubResponse.sha}`);
    console.log(`📁 File size: ${githubResponse.size} bytes`);

    // STEP 2: Process blog data (n8n Code Node)
    console.log("\n⚙️ STEP 2: Processing blog data...");
    
    const currentContent = Buffer.from(githubResponse.content, 'base64').toString('utf-8');
    const blogData = JSON.parse(currentContent);
    
    console.log(`📊 Current posts: ${blogData.posts.length}`);
    console.log(`📂 Categories: ${blogData.categories.map(c => `${c.name}(${c.count})`).join(', ')}`);

    // Create new blog post
    const newPost = {
      id: `post-${Date.now()}`,
      title: incomingBlogData.title,
      description: incomingBlogData.description || incomingBlogData.title.substring(0, 150) + '...',
      content: incomingBlogData.content,
      category: incomingBlogData.category || 'anime',
      readTime: estimateReadTime(incomingBlogData.content),
      publishDate: new Date().toISOString().split('T')[0],
      views: "0",
      tags: Array.isArray(incomingBlogData.tags) ? incomingBlogData.tags : (incomingBlogData.tags ? [incomingBlogData.tags] : []),
      featured: incomingBlogData.featured === true || incomingBlogData.featured === 'true'
    };

    console.log(`➕ New post ID: ${newPost.id}`);
    console.log(`📖 Read time: ${newPost.readTime}`);

    // Add new post to the beginning
    const updatedBlogData = {
      ...blogData,
      posts: [newPost, ...blogData.posts]
    };

    // Update category counts
    const categoryCounts = {};
    updatedBlogData.posts.forEach(post => {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });

    updatedBlogData.categories.forEach(category => {
      category.count = categoryCounts[category.name] || 0;
    });

    console.log(`📊 Updated posts: ${updatedBlogData.posts.length}`);
    console.log(`📂 Updated categories: ${updatedBlogData.categories.map(c => `${c.name}(${c.count})`).join(', ')}`);

    // STEP 3: Push updated data to GitHub (n8n HTTP Request Node 2)
    console.log("\n📤 STEP 3: Pushing updated data to GitHub...");
    
    const commitMessage = `Add new blog post: ${newPost.title}`;
    const newContent = Buffer.from(JSON.stringify(updatedBlogData, null, 2)).toString('base64');
    
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ink-splash-stories-n8n'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: newContent,
          sha: githubResponse.sha
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`GitHub update failed: ${updateResponse.status} ${await updateResponse.text()}`);
    }

    const updateResult = await updateResponse.json();
    console.log(`✅ Commit successful: ${updateResult.commit.sha}`);
    console.log(`🔗 Commit URL: ${updateResult.commit.html_url}`);

    // STEP 4: Success response (n8n Response Node)
    console.log("\n🎉 WORKFLOW COMPLETED SUCCESSFULLY!");
    
    const result = {
      success: true,
      message: "Blog post added successfully via n8n workflow!",
      post: {
        id: newPost.id,
        title: newPost.title,
        category: newPost.category,
        tags: newPost.tags
      },
      commit: {
        sha: updateResult.commit.sha,
        url: updateResult.commit.html_url
      },
      websiteUrl: "https://aniblogs-dmftjjgc8-garvishs-projects.vercel.app",
      totalPosts: updatedBlogData.posts.length
    };

    console.log("\n📋 Final Result:", JSON.stringify(result, null, 2));
    return result;

  } catch (error) {
    console.error("❌ Workflow failed:", error.message);
    return {
      success: false,
      error: error.message,
      step: "GitHub API operation"
    };
  }
}

// Helper function
function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Run the workflow simulation
n8nGitHubWorkflow().then(result => {
  if (result.success) {
    console.log("\n✅ This is exactly what your n8n workflow will do!");
    console.log("🔄 Website will update automatically within 30 seconds");
    console.log("🌐 Check: https://aniblogs-dmftjjgc8-garvishs-projects.vercel.app");
  } else {
    console.log("\n❌ Workflow simulation failed. Check the error above.");
  }
});
