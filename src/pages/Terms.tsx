import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">Terms and Conditions</h1>
          <div className="prose prose-sm lg:prose lg:max-w-none text-muted-foreground">
            <p>Welcome to Anurpan. By accessing or using our website, you agree to the following terms and conditions. Please read them carefully.</p>
            <h2>Use of the Site</h2>
            <p>You agree not to misuse the site or engage in activities that could harm the platform, its users, or violate applicable laws.</p>
            <h2>Products and Orders</h2>
            <p>All orders are subject to acceptance and availability. Product images and descriptions are for reference; minor variations may occur.</p>
            <h2>Pricing</h2>
            <p>Prices are subject to change without prior notice. Taxes and shipping charges are calculated during checkout.</p>
            <h2>Intellectual Property</h2>
            <p>All content, trademarks, and assets on this site are the property of Anurpan and may not be used without permission.</p>
            <h2>Limitation of Liability</h2>
            <p>We are not liable for indirect or consequential damages arising from use of the site or products, to the extent permitted by law.</p>
            <h2>Contact</h2>
            <p>For questions, contact us at hello@anurpan.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
