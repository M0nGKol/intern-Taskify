import Testimonial from "@/components/Testimonial";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <div className="py-6" />
        <HeroSection />
        <Features />
        <Testimonial />
        <Footer />
      </main>
    </>
  );
}
