// Test the Vercel API endpoint directly
async function testVercelAPI() {
  const url = 'https://aniblogs-dmftjjgc8-garvishs-projects.vercel.app/api/add-blog';
  
  console.log('🔍 Testing Vercel API endpoint...');
  console.log('URL:', url);
  
  try {
    // Test 1: Health check (GET)
    console.log('\n1️⃣ Testing health check (GET)...');
    const healthResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', healthResponse.status);
    console.log('Headers:', Object.fromEntries(healthResponse.headers));
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      const errorText = await healthResponse.text();
      console.log('❌ Health check failed:', errorText);
      return false;
    }
    
    // Test 2: Add blog post (POST)
    console.log('\n2️⃣ Testing blog post creation (POST)...');
    const testBlog = {
      title: "Test Blog from Vercel API",
      content: "This is a test blog post created through the Vercel serverless function. It should automatically update the GitHub repository and reflect on the website.",
      category: "anime",
      tags: ["test", "vercel", "api"],
      description: "Testing the complete workflow"
    };
    
    console.log('Sending blog data:', testBlog);
    
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testBlog)
    });
    
    console.log('POST Status:', postResponse.status);
    console.log('POST Headers:', Object.fromEntries(postResponse.headers));
    
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('✅ Blog post created successfully:', postData);
      return true;
    } else {
      const errorText = await postResponse.text();
      console.log('❌ Blog post creation failed:', errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// Run the test
testVercelAPI().then(success => {
  if (success) {
    console.log('\n🎉 Vercel API is working perfectly!');
    console.log('🌐 Check your website: https://aniblogs-dmftjjgc8-garvishs-projects.vercel.app');
    console.log('📝 You can now use this endpoint in n8n for automated blog posting!');
  } else {
    console.log('\n❌ API test failed. Check the logs above for details.');
  }
});
