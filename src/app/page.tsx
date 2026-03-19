import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main className="w-full max-w-[1440px] mx-auto">
      <HeroSection />
      <AboutSection />
    </main>
  );
}
