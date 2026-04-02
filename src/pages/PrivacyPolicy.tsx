import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <div className="prose prose-sm lg:prose lg:max-w-none text-muted-foreground">
            <h2>Information We Collect</h2>
            <p>We collect information you provide during checkout or account creation, including contact details and order information.</p>
            <h2>How We Use Information</h2>
            <p>Your data is used to process orders, provide customer support, and improve our services. We do not sell your personal data.</p>
            <h2>Cookies</h2>
            <p>We use cookies to enhance site functionality and analytics. You can manage cookies in your browser settings.</p>
            <h2>Data Security</h2>
            <p>We implement reasonable safeguards to protect your data. However, no method of transmission is completely secure.</p>
            <h2>Third-Party Services</h2>
            <p>We may integrate payment and shipping providers; they operate under their own policies.</p>
            <h2>Your Rights</h2>
            <p>You can request access, correction, or deletion of your personal data by contacting us.</p>
            <h2>Contact</h2>
            <p>For privacy queries, email hello@anurpan.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
