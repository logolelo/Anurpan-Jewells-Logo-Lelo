import { AlertCircle, CheckCircle, Clock, Package, Truck } from "lucide-react";

type StatusBadgeProps = {
  fulfillmentStatus?: string | null;
  latestShipmentStatus?: string | null;
};

export function StatusBadge({ fulfillmentStatus, latestShipmentStatus }: StatusBadgeProps) {
  const key = (latestShipmentStatus || fulfillmentStatus || "").toUpperCase();
  let color = "bg-muted text-foreground";
  let label = "Pending";
  let Icon = Clock;
  if (key.includes("DELIVERED")) {
    color = "bg-green-600/10 text-green-700";
    label = "Delivered";
    Icon = CheckCircle;
  } else if (key.includes("IN_TRANSIT") || key.includes("OUT_FOR_DELIVERY")) {
    color = "bg-blue-600/10 text-blue-700";
    label = "In Transit";
    Icon = Truck;
  } else if (key.includes("FULFILLED")) {
    color = "bg-secondary/15 text-secondary";
    label = "Fulfilled";
    Icon = Package;
  } else if (key.includes("PENDING") || key.includes("UNFULFILLED")) {
    color = "bg-muted text-foreground";
    label = "Pending";
    Icon = Clock;
  } else {
    color = "bg-muted text-foreground";
    label = key || "Unknown";
    Icon = AlertCircle;
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

