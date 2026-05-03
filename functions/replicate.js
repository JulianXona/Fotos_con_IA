exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action, image, predictionId } = JSON.parse(event.body);
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API token not configured' })
      };
    }

    const prompt = "Professional McDonald's Employee of the Month portrait photograph. Person wearing official McDonald's red and yellow uniform with cap, name badge visible. Clean professional headshot style with McDonald's restaurant background. Golden Arches logo visible. Employee of the Month certificate style. High quality, professional lighting, corporate photography style. Square format portrait, centered composition.";

    // Create prediction
    if (action === 'create') {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "e23665f88d8f2e04ea735392cea3b8e1e4f4e25fef27f0e3f7f95c95a6f8d913",
          input: {
            prompt: prompt,
            image: image,
            go_fast: true,
            guidance: 3.5,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "jpg",
            output_quality: 90,
            prompt_strength: 0.8,
            num_inference_steps: 28
          }
        })
      });

      const data = await response.json();
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify(data)
      };
    }

    // Get prediction status
    if (action === 'get' && predictionId) {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      const data = await response.json();
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
