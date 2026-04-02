import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">Refund Policy</h1>
          <div className="prose prose-sm lg:prose lg:max-w-none text-muted-foreground">
            <h2>Returns</h2>
            <p>We accept returns within 7 days of delivery for unused items in original packaging. Customized items may not be eligible.</p>
            <h2>Refunds</h2>
            <p>Once your return is received and inspected, we will process a refund to your original payment method. Shipping fees are non-refundable.</p>
            <h2>Exchanges</h2>
            <p>Exchanges are subject to stock availability. Please contact us before sending the item.</p>
            <h2>Damaged or Incorrect Items</h2>
            <p>If you receive a damaged or incorrect item, contact us within 48 hours of delivery with photos and order details.</p>
            <h2>Contact</h2>
            <p>For return requests, email hello@anurpan.com with your order number.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
