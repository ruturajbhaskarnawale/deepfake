import { Hero } from "@/components/landing/Hero";
import { KeyCapabilities } from "@/components/landing/KeyCapabilities";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <KeyCapabilities />
    </div>
  );
}
