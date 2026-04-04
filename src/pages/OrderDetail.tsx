import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { customerAccountRequest, CUSTOMER_ORDER_QUERY } from "@/lib/customerAccount";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { startLogin, isAuthenticated } from "@/lib/auth";
import { User } from "lucide-react";

type Money = { amount?: string; currencyCode?: string } | null;
type Address = {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
} | null;
type FulfillmentInfo = {
  status?: string;
  trackingInfo?: Array<{ number?: string; url?: string; company?: string }>;
  createdAt?: string;
};
type LineItemNode = {
  title?: string;
  quantity?: number;
  totalPrice?: Money;
  currentTotalPrice?: Money;
  variantTitle?: string;
  image?: { url?: string; altText?: string } | null;
};
type Order = {
  id: string;
  name?: string;
  processedAt?: string;
  fulfillmentStatus?: string;
  financialStatus?: string;
  totalPrice?: Money;
  totalShipping?: Money;
  totalTax?: Money;
  shippingAddress?: Address;
  lineItems?: { edges?: Array<{ node: LineItemNode }> } | null;
  fulfillments?: { edges?: Array<{ node: FulfillmentInfo }> } | null;
};

export default function OrderDetail() {
  const authed = isAuthenticated();
  const { orderId: encoded } = useParams();
  const orderId = encoded ? decodeURIComponent(encoded) : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authed || !orderId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    customerAccountRequest(CUSTOMER_ORDER_QUERY, { id: orderId })
      .then((data) => {
        if (!mounted) return;
        if (!data || typeof data !== "object") {
          setError("Failed to fetch order details.");
          return;
        }
        const d = data as { data?: { order?: Order } };
        if (!d.data?.order) {
          setError("Order not found.");
          return;
        }
        setOrder(d.data.order);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to fetch order details.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [authed, orderId]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold mb-6">Order Details</h1>
        {!authed ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">Please sign in to view your orders.</p>
            <Button onClick={() => startLogin()} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Sign in
            </Button>
          </div>
        ) : loading ? (
          <p className="text-muted-foreground">Loading order...</p>
        ) : error ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm space-y-2">
            <p>{error}</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{order.name}</p>
                <p className="text-sm text-muted-foreground">{order.processedAt ? new Date(order.processedAt).toLocaleString() : ""}</p>
              </div>
              <div className="text-right">
                {order.fulfillmentStatus && (
                  <p className="text-xs px-2 py-1 rounded bg-muted inline-block">{order.fulfillmentStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                )}
                {order.financialStatus && (
                  <p className="text-xs px-2 py-1 rounded bg-muted inline-block mt-1">{order.financialStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                )}
                <p className="font-medium">
                  {order.totalPrice?.amount} {order.totalPrice?.currencyCode}
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h2 className="font-display text-xl font-semibold">Items</h2>
                {order.lineItems?.edges && order.lineItems.edges.length > 0 ? (
                  <div className="divide-y">
                    {order.lineItems.edges.map(({ node }, idx) => {
                      const name = node.title || node.variantTitle || "Item";
                      const img = node.image?.url;
                      return (
                        <div key={idx} className="py-3 flex items-center gap-3">
                          {img ? <img src={img} alt={node.image?.altText || name} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 rounded bg-muted" />}
                          <div className="flex-1">
                            <p className="text-sm">{name}</p>
                            <p className="text-xs text-muted-foreground">Qty {node.quantity ?? 1}</p>
                          </div>
                          <div className="text-sm">
                            {(node.currentTotalPrice?.amount ?? node.totalPrice?.amount) || ""} {(node.currentTotalPrice?.currencyCode ?? node.totalPrice?.currencyCode) || ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No items.</p>
                )}
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-xl font-semibold">Shipping</h2>
                {order.shippingAddress ? (
                  <div className="text-sm">
                    <p>{[order.shippingAddress.firstName, order.shippingAddress.lastName].filter(Boolean).join(" ")}</p>
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>{[order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.zip].filter(Boolean).join(", ")}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No shipping address.</p>
                )}
                <div className="text-sm">
                  <p>Shipping: {order.totalShipping?.amount} {order.totalShipping?.currencyCode}</p>
                  <p>Tax: {order.totalTax?.amount} {order.totalTax?.currencyCode}</p>
                  <p>Total: {order.totalPrice?.amount} {order.totalPrice?.currencyCode}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold">Fulfillment</h2>
              {order.fulfillments?.edges && order.fulfillments.edges.length > 0 ? (
                <div className="space-y-2">
                  {order.fulfillments.edges.map(({ node }, idx) => (
                    <div key={idx} className="border border-border rounded-md p-3">
                      <p className="text-sm mb-1">{node.status}</p>
                      <p className="text-xs text-muted-foreground">{node.createdAt ? new Date(node.createdAt).toLocaleString() : ""}</p>
                      {node.trackingInfo && node.trackingInfo.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {node.trackingInfo.map((t, i) => (
                            <div key={i} className="text-sm">
                              <span className="mr-2">{t.company}</span>
                              <span className="mr-2">{t.number}</span>
                              {t.url && <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-primary">Track</a>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No fulfillment records.</p>
              )}
            </div>
            <div>
              <Link to="/account" className="text-primary text-sm">Back to orders</Link>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
