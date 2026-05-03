export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, imageBase64, generationId, imageUrl, imageId } = req.body;
    const apiKey = process.env.LEONARDO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Leonardo API key not configured' });
    }

    // Step 1: Upload image to Leonardo
    if (action === 'upload') {
      // Request upload URL
      const uploadRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${apiKey}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          extension: 'png'
        })
      });

      const uploadData = await uploadRes.json();
      
      if (!uploadData.uploadInitImage) {
        throw new Error('Failed to get upload URL');
      }

      // Convert base64 to buffer and upload
      const base64Data = imageBase64.split(',')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      
      const putRes = await fetch(uploadData.uploadInitImage.url, {
        method: 'PUT',
        body: binaryData,
        headers: {
          'Content-Type': 'image/png'
        }
      });

      if (!putRes.ok) {
        throw new Error('Failed to upload image to S3');
      }

      return res.status(200).json({ 
        imageId: uploadData.uploadInitImage.id
      });
    }

    // Step 1.5: Verify init image is ready
    if (action === 'verify') {
      const verifyRes = await fetch(`https://cloud.leonardo.ai/api/rest/v1/init-image/${imageId}`, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${apiKey}`
        }
      });

      const data = await verifyRes.json();
      return res.status(verifyRes.status).json(data);
    }

    // Step 2: Create generation with uploaded image
    if (action === 'create') {
      const genRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${apiKey}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          prompt: "professional employee portrait, person wearing red and yellow McDonald's employee uniform with cap and name badge, inside McDonald's restaurant, professional photography, realistic, high quality",
          negative_prompt: "cartoon, anime, drawing, painting, illustration, different person, different face, ugly, deformed, blurry",
          modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
          width: 1024,
          height: 1024,
          num_images: 1,
          init_image_id: imageUrl,
          init_strength: 0.35
        })
      });

      const data = await genRes.json();
      return res.status(genRes.status).json(data);
    }

    // Step 3: Get generation result
    if (action === 'get' && generationId) {
      const genRes = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${apiKey}`
        }
      });

      const data = await genRes.json();
      return res.status(genRes.status).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Leonardo API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
