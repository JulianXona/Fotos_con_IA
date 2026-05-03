export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { action, image, predictionId } = req.body;

    // Get API token from environment variable
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

    if (!REPLICATE_API_TOKEN) {
      res.status(500).json({ error: 'API token not configured' });
      return;
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
      
      if (!response.ok) {
        res.status(response.status).json(data);
        return;
      }
      
      res.status(200).json(data);
      return;
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
      
      if (!response.ok) {
        res.status(response.status).json(data);
        return;
      }
      
      res.status(200).json(data);
      return;
    }

    res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

