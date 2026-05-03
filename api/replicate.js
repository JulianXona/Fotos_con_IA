export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, image, predictionId } = req.body;
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return res.status(500).json({ error: 'API token not configured' });
    }

    const prompt = "Professional McDonald's Employee of the Month portrait photograph. Person wearing official McDonald's red and yellow uniform with cap, name badge visible. Clean professional headshot style with McDonald's restaurant background. Golden Arches logo visible. Employee of the Month certificate style. High quality, professional lighting, corporate photography style. Square format portrait, centered composition.";

    if (action === 'create') {
      const apiRes = await fetch('https://api.replicate.com/v1/predictions', {
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

      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);
    }

    if (action === 'get' && predictionId) {
      const apiRes = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      const data = await apiRes.json();
      return res.status(apiRes.status).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
