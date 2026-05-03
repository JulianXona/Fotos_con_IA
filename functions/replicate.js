exports.handler = async (event) => {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { action, image, predictionId } = JSON.parse(event.body);
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Token not configured' }) };
    }

    // Create
    if (action === 'create') {
      const res = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          input: {
            prompt: "person wearing red and yellow McDonald's employee uniform with cap and name badge, professional portrait photography, McDonald's restaurant interior background, well-lit, high quality",
            image: image,
            negative_prompt: "deformed face, different person, ugly, bad anatomy, blurry, low quality",
            strength: 0.4,
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        })
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    // Get
    if (action === 'get' && predictionId) {
      const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };

  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
