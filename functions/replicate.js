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
    const { action, imageBase64, generationId, imageUrl } = JSON.parse(event.body);
    const apiKey = process.env.LEONARDO_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Leonardo API key not configured' }) };
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

      // Convert base64 to blob and upload
      const base64Data = imageBase64.split(',')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      
      await fetch(uploadData.uploadInitImage.url, {
        method: 'PUT',
        body: binaryData,
        headers: {
          'Content-Type': 'image/png'
        }
      });

      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ 
          imageId: uploadData.uploadInitImage.id,
          fields: uploadData.uploadInitImage.fields 
        }) 
      };
    }

    // Step 2: Create generation with uploaded image
    if (action === 'create') {
      const res = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
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
          init_image_id: imageUrl, // This is the ID from upload
          init_strength: 0.35
        })
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    // Step 3: Get generation result
    if (action === 'get' && generationId) {
      const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${apiKey}`
        }
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };

  } catch (error) {
    console.error('Leonardo API Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
