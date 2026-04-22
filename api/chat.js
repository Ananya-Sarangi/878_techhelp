module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages } = req.body;

  if (!messages || !system) {
    return res.status(400).json({ error: 'Missing messages or system prompt' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1000,
        messages: [{ role: 'system', content: system }, ...messages]
      })
    });

    const data = await response.json();

    if (data.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: data.error?.message || 'No response from AI' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to AI service' });
  }
};
