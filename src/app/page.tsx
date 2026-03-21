import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import PerformanceInitializer from "@/components/PerformanceInitializer";
import QualitySettingsPanel from "@/components/QualitySettingsPanel";

export default function Home() {
  return (
    <PerformanceInitializer>
      <main className="w-full max-w-360 mx-auto">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
      </main>
      
      {/* Quality Settings Panel for manual override */}
      <QualitySettingsPanel isVisible={true} />
    </PerformanceInitializer>
  );
}
