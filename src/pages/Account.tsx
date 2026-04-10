import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { isAuthenticated, getIdTokenClaims, startLogin } from "@/lib/auth";
import { useEffect, useState } from "react";
import { customerAccountRequest, CUSTOMER_ORDERS_QUERY, getCustomerAccountEndpoint } from "@/lib/customerAccount";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { resolveProductHandles } from "@/lib/shopify";

export default function Account() {
  const authed = isAuthenticated();
  const claims = getIdTokenClaims();
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (claims) {
      console.log("ID Token Claims:", claims);
      const name = (claims.name as string) || (claims.given_name as string) || (claims.displayName as string) || "";
      const email = (claims.email as string) || "";
      setCustomerInfo({ name, email });
    }
  }, [claims]);

  type OrderNode = {
    id: string;
    name?: string;
    number?: number;
    processedAt?: string;
    financialStatus?: string;
    totalPrice?: { amount: string; currencyCode: string } | null;
    subtotalPrice?: { amount: string; currencyCode: string } | null;
    totalShippingPrice?: { amount: string; currencyCode: string } | null;
    totalTax?: { amount: string; currencyCode: string } | null;
    statusPageUrl?: string;
    fulfillmentStatus?: string;
    shippingAddress?: {
      address1?: string;
      address2?: string;
      city?: string;
      zoneCode?: string;
      zip?: string;
      territoryCode?: string;
    } | null;
    fulfillments?: {
      nodes: Array<{
        latestShipmentStatus?: string;
        estimatedDeliveryAt?: string;
        trackingInformation?: Array<{ number?: string; url?: string }>;
      }>;
    };
    lineItems?: {
      nodes: Array<{
        id: string;
        title?: string;
        quantity?: number;
        variantTitle?: string;
        sku?: string;
        productId?: string;
        totalPrice?: { amount: string; currencyCode: string } | null;
        image?: { url?: string; altText?: string };
      }>;
    };
  };
  const [orders, setOrders] = useState<OrderNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [handleMap, setHandleMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authed) {
      setOrders(null);
      setError(null);
      setCustomerInfo(null);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    customerAccountRequest(CUSTOMER_ORDERS_QUERY, { first: 10 })
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setError("Customer Account API endpoint or token missing.");
          setOrders(null);
          return;
        }
        type GraphQLHttpError = { __httpError: string; __body?: string };
        type GraphQLErrorItem = { message: string };
        type GraphQLSuccess = { data?: { customer?: { firstName?: string; lastName?: string; displayName?: string; emailAddress?: { emailAddress: string }; orders?: { edges?: Array<{ node: OrderNode }> } } }; errors?: GraphQLErrorItem[] };
        if (typeof data === 'object' && data !== null && '__httpError' in data) {
          const httpErr = data as GraphQLHttpError & { __endpoint?: string };
          let bodyMsg = httpErr.__body || "";
          if (bodyMsg.length > 200) {
            bodyMsg = bodyMsg.substring(0, 200) + "... (truncated)";
          }
          if (bodyMsg.includes("<!DOCTYPE html>") || bodyMsg.includes("<html")) {
            bodyMsg = "HTML Error Page received from Shopify. This usually means the endpoint or Shop ID is incorrect.";
          }
          const endpointMsg = httpErr.__endpoint ? ` (Endpoint: ${httpErr.__endpoint})` : "";
          setError(`Customer Account API HTTP error: ${httpErr.__httpError} - ${bodyMsg}${endpointMsg}`);
          setOrders(null);
          return;
        }
        if (typeof data === 'object' && data !== null && 'error' in data && (data as { error?: string }).error === 'Internal Server Error') {
          const err = data as { message?: string; endpoint?: string };
          setError(`Server Error: ${err.message} - Endpoint: ${err.endpoint || 'unknown'}`);
          setOrders(null);
          return;
        }
        const success = data as GraphQLSuccess;
        if (success.errors && success.errors.length > 0) {
          setError(`Customer Account API error: ${success.errors[0].message}`);
        }
        
        // Update customer info from GraphQL data if available
        const customer = success?.data?.customer;
        if (customer) {
          const firstName = customer.firstName || "";
          const lastName = customer.lastName || "";
          const fullName = customer.displayName || [firstName, lastName].filter(Boolean).join(" ");
          const email = customer.emailAddress?.emailAddress || "";
          if (fullName || email) {
            setCustomerInfo({ 
              name: fullName || customerInfo?.name || "", 
              email: email || customerInfo?.email || "" 
            });
          }
        }
        
        const edges = success?.data?.customer?.orders?.edges ?? [];
        const nodes = edges.map((e) => e.node);
        setOrders(nodes);
        const ids: string[] = [];
        nodes.forEach((o) => {
          o.lineItems?.nodes?.forEach((li) => {
            if (li.productId) ids.push(li.productId);
          });
        });
        resolveProductHandles(ids).then((map) => setHandleMap(map));
      })
      .catch(() => {
        if (!mounted) return;
        setOrders(null);
        setError("Failed to fetch orders from Customer Account API.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [authed]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold mb-6">My Account</h1>
        {authed ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="text-lg font-medium">{customerInfo?.name || customerInfo?.email || "Customer"}</p>
              {customerInfo?.name && customerInfo?.email && (
                <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
              )}
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold">Orders</h2>
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm space-y-2">
                  <p>{error}</p>
                  <p className="text-xs opacity-70">If this error persists, please check your Vercel logs and ensure your Customer Account API is correctly configured in Shopify Admin.</p>
                </div>
              )}
              {loading ? (
                <p className="text-muted-foreground">Loading orders...</p>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.map((o) => (
                    <div key={o.id} className="border border-border rounded-md p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium">{o.name || `Order #${o.number}`}</p>
                          <p className="text-sm text-muted-foreground">{o.processedAt ? new Date(o.processedAt).toLocaleString() : ""}</p>
                          <div className="mt-1">
                            <StatusBadge
                              fulfillmentStatus={o.fulfillmentStatus}
                              latestShipmentStatus={o.fulfillments?.nodes?.[0]?.latestShipmentStatus}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {o.totalPrice?.amount} {o.totalPrice?.currencyCode}
                          </p>
                          {o.statusPageUrl && (
                            <a href={o.statusPageUrl} className="text-primary text-sm" target="_blank" rel="noopener noreferrer">Track</a>
                          )}
                        </div>
                      </div>
                      {o.lineItems?.nodes && o.lineItems.nodes.length > 0 && (
                        <div className="mt-2">
                          <div className="grid gap-3">
                            {o.lineItems.nodes.slice(0, 2).map((li) => {
                              const handle = li.productId ? handleMap[li.productId] : undefined;
                              const link = handle ? `/product/${handle}` : undefined;
                              return (
                                <div key={li.id} className="flex items-center gap-3">
                                  <div className="h-16 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                                    {li.image?.url ? (
                                      <img src={li.image.url} alt={li.image.altText || li.title || ""} className="h-full w-full object-cover" />
                                    ) : (
                                      <div className="text-xs text-muted-foreground">No image</div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    {link ? (
                                      <Link to={link} className="text-sm font-medium hover:underline">{li.title}</Link>
                                    ) : (
                                      <p className="text-sm font-medium">{li.title}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">Qty: {li.quantity}{li.variantTitle ? ` • ${li.variantTitle}` : ""}</p>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {li.totalPrice?.amount ? `${li.totalPrice.amount} ${li.totalPrice.currencyCode}` : ""}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {o.lineItems.nodes.length > 2 && (
                            <button
                              className="mt-2 text-xs text-primary hover:underline"
                              onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                            >
                              {expandedOrder === o.id ? "Hide items" : `+${o.lineItems.nodes.length - 2} more items`}
                            </button>
                          )}
                        </div>
                      )}
                      {expandedOrder === o.id && o.lineItems?.nodes && (
                        <div className="mt-3 grid gap-3">
                          {o.lineItems.nodes.map((li) => {
                            const handle = li.productId ? handleMap[li.productId] : undefined;
                            const link = handle ? `/product/${handle}` : undefined;
                            return (
                              <div key={li.id} className="flex items-center gap-3">
                                <div className="h-16 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                                  {li.image?.url ? (
                                    <img src={li.image.url} alt={li.image.altText || li.title || ""} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="text-xs text-muted-foreground">No image</div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  {link ? (
                                    <Link to={link} className="text-sm font-medium hover:underline">{li.title}</Link>
                                  ) : (
                                    <p className="text-sm font-medium">{li.title}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">Qty: {li.quantity}{li.variantTitle ? ` • ${li.variantTitle}` : ""}</p>
                                </div>
                                <div className="text-sm">
                                  {li.totalPrice?.amount ? `${li.totalPrice.amount} ${li.totalPrice.currencyCode}` : ""}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            const f = o.fulfillments?.nodes?.[0];
                            const eta = f?.estimatedDeliveryAt ? new Date(f.estimatedDeliveryAt).toLocaleDateString() : "";
                            const ti = f?.trackingInformation?.[0];
                            return (
                              <>
                                {eta && <div>ETA: {eta}</div>}
                                {ti?.url && (
                                  <a href={ti.url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                    Tracking
                                  </a>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <div className="text-sm text-right space-y-0.5">
                          <div className="text-muted-foreground">Subtotal: {o.subtotalPrice?.amount ? `${o.subtotalPrice.amount} ${o.subtotalPrice.currencyCode}` : "-"}</div>
                          <div className="text-muted-foreground">Shipping: {o.totalShippingPrice?.amount ? `${o.totalShippingPrice.amount} ${o.totalShippingPrice.currencyCode}` : "-"}</div>
                          <div className="text-muted-foreground">Tax: {o.totalTax?.amount ? `${o.totalTax.amount} ${o.totalTax.currencyCode}` : "-"}</div>
                          <div className="font-semibold">Total: {o.totalPrice?.amount} {o.totalPrice?.currencyCode}</div>
                        </div>
                      </div>
                      {o.shippingAddress && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {(() => {
                            const a = o.shippingAddress;
                            const parts = [a.address1, a.address2, a.city, a.zoneCode, a.zip, a.territoryCode].filter(Boolean);
                            return parts.join(", ");
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground">No orders found.</p>
                  <div className="mt-4 p-4 bg-muted rounded-md text-xs space-y-1">
                    <p><strong>Debug Info:</strong></p>
                    <p>Endpoint: {getCustomerAccountEndpoint() || "not set"}</p>
                    <p>Authenticated: {authed ? "Yes" : "No"}</p>
                    <p>Has Access Token: {localStorage.getItem("customer_access_token") ? "Yes" : "No"}</p>
                    <p>Has ID Token: {localStorage.getItem("customer_id_token") ? "Yes" : "No"}</p>
                    {claims && <p>ID Token Claims: {JSON.stringify(claims).slice(0, 100)}...</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">Please sign in to view your account and orders.</p>
            <Button onClick={() => startLogin()} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Sign in
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
