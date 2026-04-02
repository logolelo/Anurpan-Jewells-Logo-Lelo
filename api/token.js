export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { code, code_verifier, client_id, redirect_uri } = req.body;

  if (!code || !code_verifier || !client_id || !redirect_uri) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  // Extract Shop ID from client ID or use a configured environment variable
  // Usually, the TOKEN_URL should be in the format: 
  // https://shopify.com/authentication/<shop_id>/oauth/token
  const authTokenUrl = (process.env.VITE_CUSTOMER_AUTH_TOKEN_URL || '').replace(/[`'"]/g, "");
  const shopIdMatch = authTokenUrl.match(/\/authentication\/(\d+)\//);
  const shopId = shopIdMatch ? shopIdMatch[1] : ''; 
  const tokenUrl = `https://shopify.com/authentication/${shopId}/oauth/token`;

  try {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('client_id', client_id);
    body.set('redirect_uri', redirect_uri);
    body.set('code_verifier', code_verifier);

    console.log(`[TokenExchange] Exchanging code for token at: ${tokenUrl}`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[TokenExchange] Error from Shopify:', data);
      res.status(response.status).json(data);
      return;
    }

    // Return the tokens to the client
    res.status(200).json(data);
  } catch (error) {
    console.error('[TokenExchange] Fetch failed:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}
