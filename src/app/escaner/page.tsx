import { LiquidBackground } from "@/components/landing/LiquidBackground";
import { Header } from "@/components/landing/Header";
import { Scanner } from "@/components/landing/Scanner";
import { Footer } from "@/components/landing/Footer";

export default function EscanerPage() {
  return (
    <>
      <LiquidBackground />
      <Header />
      <main className="relative z-10 pt-24">
        <Scanner />
        <Footer />
      </main>
    </>
  );
}
