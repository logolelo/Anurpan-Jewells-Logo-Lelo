import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 lg:py-14 max-w-4xl">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">About Us</h1>
          
          <div className="prose prose-sm lg:prose-lg lg:max-w-none text-muted-foreground space-y-6">
            <p className="text-lg leading-relaxed">
              At <strong className="text-foreground">Anurpan Jewellery</strong>, we believe jewellery is more than an accessory — it is a reflection of confidence, individuality, and timeless elegance. Our brand is created with a passion for designing pieces that celebrate modern femininity while honoring fine craftsmanship.
            </p>

            <p className="text-lg leading-relaxed">
              We specialize in creating jewellery especially for the modern office-going woman — the woman who leads, achieves, and inspires every day. Our collections are thoughtfully designed to be <strong className="text-foreground">lightweight, anti-allergic, anti-tarnish and long-lasting</strong>, ensuring comfort without compromising on style. Whether you're in a boardroom meeting, at a formal event, or out for a casual evening, Anurpan Jewellery complements your look effortlessly.
            </p>

            <p className="text-lg leading-relaxed">
              Each piece is crafted with high-quality materials and meticulous attention to detail. We blend contemporary designs with subtle sophistication, making our jewellery perfect for daily wear while maintaining a refined, elegant appeal.
            </p>

            <p className="text-lg leading-relaxed">
              Our mission is to empower women with jewellery that feels as good as it looks — comfortable, durable, and beautifully designed. Because we understand that today’s woman needs jewellery that moves with her lifestyle.
            </p>

            <div className="pt-8 border-t border-border text-center">
              <p className="text-xl font-display font-bold text-foreground italic">
                Anurpan Jewellery — Designed for the Modern Woman. Crafted for Everyday Elegance.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
