import { Hero } from "@/components/landing/Hero";
import { KeyCapabilities } from "@/components/landing/KeyCapabilities";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <KeyCapabilities />
    </div>
  );
}
