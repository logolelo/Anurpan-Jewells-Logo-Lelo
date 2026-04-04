const CUSTOMER_ACCOUNT_GRAPHQL_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_GRAPHQL_URL as string | undefined;
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
const DEFAULT_GRAPHQL_URL = STORE_DOMAIN ? `https://${STORE_DOMAIN}/customer/api/graphql` : undefined;
const PROXY_PATH = '/api/customer-account';

export async function customerAccountRequest(query: string, variables: Record<string, unknown> = {}) {
  const token = localStorage.getItem("customer_access_token");
  const endpoint = typeof window !== 'undefined' ? `${window.location.origin}${PROXY_PATH}` : CUSTOMER_ACCOUNT_GRAPHQL_URL || DEFAULT_GRAPHQL_URL;
  if (!token || !endpoint) return null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (endpoint.includes('/api/customer-account')) {
    headers['Authorization'] = token;
  } else {
    headers['X-Shopify-Access-Token'] = token;
  }
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  
  if (!res.ok) {
    // If the proxy returned a structured error, use it.
    if (typeof json === 'object' && json !== null && ('__httpError' in json || 'error' in json)) {
      return {
        ...(json as Record<string, unknown>),
        __httpError: (json as Record<string, unknown>).__httpError || `${res.status} ${res.statusText}`,
        __body: (json as Record<string, unknown>).__body || text
      };
    }
    return { __httpError: `${res.status} ${res.statusText}`, __body: text };
  }
  return json ?? { __body: text };
}

export const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders($first: Int!, $reverse: Boolean = true) {
    customer {
      id
      orders(first: $first, sortKey: PROCESSED_AT, reverse: $reverse) {
        nodes {
          id
          name
          processedAt
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              id
              title
              quantity
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const CUSTOMER_ORDER_QUERY = `
  query CustomerOrder($id: ID!) {
    order(id: $id) {
            id
      name
      processedAt
      fulfillmentStatus
      totalPrice {
        amount
        currencyCode
      }
      lineItems(first: 50) {
        nodes {
          id
          title
          quantity
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export function getCustomerAccountEndpoint() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${PROXY_PATH}`;
  }
  return CUSTOMER_ACCOUNT_GRAPHQL_URL || DEFAULT_GRAPHQL_URL || null;
}
