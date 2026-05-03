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
          version: "2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
          input: {
            image: image,
            prompt: "professional employee portrait photo, person wearing red and yellow McDonald's uniform with cap and name badge, inside McDonald's restaurant with Golden Arches visible in background, well lit, high quality photo, realistic, professional photography",
            negative_prompt: "cartoon, anime, drawing, painting, 3d render, illustration, different person, different face, ugly, deformed, blurry, bad quality",
            num_outputs: 1,
            num_inference_steps: 30,
            guidance_scale: 5,
            ip_adapter_scale: 0.8,
            controlnet_conditioning_scale: 0.8,
            enable_pose_controlnet: true,
            pose_strength: 0.4,
            enhance_nonface_region: true,
            sdxl_weights: "protovision-xl-high-fidel",
            scheduler: "EulerDiscreteScheduler",
            output_format: "png",
            output_quality: 90
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
