import Testimonial from "@/components/landingPage/Testimonial";
import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";

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
