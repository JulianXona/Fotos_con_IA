export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const body = await request.json();
    const { action, image, predictionId } = body;

    // Get API token from environment variable
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

    if (!REPLICATE_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'API token not configured' }),
        { status: 500, headers }
      );
    }

    const AI_PROMPT = `Professional McDonald's Employee of the Month portrait photograph. Person wearing official McDonald's red and yellow uniform with cap, name badge visible. Clean professional headshot style with McDonald's restaurant background. Golden Arches logo visible. Employee of the Month certificate style. High quality, professional lighting, corporate photography style. Square format portrait, centered composition.`;

    // Create prediction
    if (action === 'create') {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "e23665f88d8f2e04ea735392cea3b8e1e4f4e25fef27f0e3f7f95c95a6f8d913",
          input: {
            prompt: AI_PROMPT,
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
      return new Response(JSON.stringify(data), { status: response.status, headers });
    }

    // Get prediction status
    if (action === 'get' && predictionId) {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
          }
        }
      );

      const data = await response.json();
      return new Response(JSON.stringify(data), { status: response.status, headers });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
}
