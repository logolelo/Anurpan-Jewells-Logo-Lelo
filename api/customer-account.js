export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) {
    res.status(400).json({ error: 'Missing authorization token' });
    return;
  }
  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }
  const query = body.query;
  const variables = body.variables || {};
  if (!query) {
    res.status(400).json({ error: 'Missing GraphQL query' });
    return;
  }
  const envEndpoint = (process.env.VITE_CUSTOMER_ACCOUNT_GRAPHQL_URL || process.env.CUSTOMER_ACCOUNT_GRAPHQL_URL || "").replace(/[`'"]/g, "");
  const storeDomain = (process.env.VITE_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || 'anurpan-logo-lelo.myshopify.com').replace(/[`'"]/g, "");
  
  // Try to extract Shop ID from auth URLs if available
  const authUrl = (process.env.VITE_CUSTOMER_AUTH_AUTH_URL || '').replace(/[`'"]/g, "");
  const shopIdMatch = authUrl.match(/\/authentication\/(\d+)\//);
  const shopId = shopIdMatch ? shopIdMatch[1] : '75294244911'; 
  const apiVersion = (process.env.VITE_SHOPIFY_API_VERSION || '2024-07').replace(/[`'"]/g, "");
  
  // The correct Customer Account API endpoint format often requires the /customer/ subpath
  const shopifyAccountEndpoint = `https://shopify.com/${shopId}/account/customer/api/${apiVersion}/graphql`;
  
  // Try to discover the endpoint dynamically from the storefront domain
  let discoveredEndpoint = null;
  try {
    const discoveryUrl = `https://${storeDomain}/.well-known/customer-account-api`;
    const discoveryRes = await fetch(discoveryUrl);
    if (discoveryRes.ok) {
      const discoveryData = await discoveryRes.json();
      if (discoveryData.graphql_api) {
        discoveredEndpoint = discoveryData.graphql_api;
        console.log(`[CustomerAccountProxy] Discovered endpoint: ${discoveredEndpoint}`);
      }
    }
  } catch (err) {
    console.warn(`[CustomerAccountProxy] Discovery failed: ${err.message}`);
  }

  // If the user has manually set a full shopify.com/account/api endpoint, use it.
  // Otherwise, use the discovered endpoint or the standard shopifyAccountEndpoint.
  const endpoint = envEndpoint || discoveredEndpoint || shopifyAccountEndpoint;
  
  // Debug log for Vercel logs
  console.log(`[CustomerAccountProxy] Using endpoint: ${endpoint}`);
  console.log(`[CustomerAccountProxy] Store Domain: ${storeDomain}`);
  console.log(`[CustomerAccountProxy] Shop ID: ${shopId}`);
  
  if (!endpoint) {
    res.status(500).json({ error: 'Endpoint not configured' });
    return;
  }
  
  try {
    // Try first with simple Authorization: token
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token, 
      },
      body: JSON.stringify({ query, variables }),
    });
    
    let text = await r.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { __body: text };
    }
    
    if (r.status >= 400) {
      console.error(`[CustomerAccountProxy] Error from Shopify (${r.status}): ${text}`);
      
      // Fallback 1: Bearer token
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const r2 = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': bearerToken,
        },
        body: JSON.stringify({ query, variables }),
      });
      
      let text2 = await r2.text();
      let json2;
      try {
        json2 = JSON.parse(text2);
      } catch {
        json2 = { __body: text2 };
      }
      
      if (r2.status < 400) {
        res.status(r2.status).json(json2);
        return;
      }

      // Fallback 2: shcat_ prefix if not already present
      const shcatToken = token.startsWith('shcat_') ? token : `shcat_${token}`;
      const r3 = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': shcatToken,
        },
        body: JSON.stringify({ query, variables }),
      });
      
      let text3 = await r3.text();
      let json3;
      try {
        json3 = JSON.parse(text3);
      } catch {
        json3 = { __body: text3 };
      }

      if (r3.status < 400) {
        res.status(r3.status).json(json3);
        return;
      }
      
      // Fallback 3: X-Shopify-Access-Token header
      const r4 = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({ query, variables }),
      });
      
      let text4 = await r4.text();
      let json4;
      try {
        json4 = JSON.parse(text4);
      } catch {
        json4 = { __body: text4 };
      }
      
      res.status(r4.status).json({ 
        __httpError: `${r4.status} ${r4.statusText}`, 
        __endpoint: endpoint,
        ...json4 
      });
      return;
    }
    
    res.status(r.status).json(json);
  } catch (error) {
    console.error('[CustomerAccountProxy] Fetch failed:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      endpoint: endpoint,
      hint: 'The server could not reach the Shopify Customer Account API. Check if the Shop ID and domain are correct.'
    });
  }
}
