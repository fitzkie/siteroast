"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PricingCard } from "@/components/pricing-card";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  async function handleSubscribe() {
    if (!session?.user) { router.push("/login"); return; }
    const response = await fetch("/api/subscribe", { method: "POST" });
    const data = await response.json();
    if (data.checkoutUrl) { window.location.href = data.checkoutUrl; }
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
        <p className="text-center text-gray-400 mb-12">Every roast comes with a full 6-category audit, PDF download, and shareable link.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingCard title="Single Report" price="$29" period="one-time"
            features={["Full 6-category audit", "Downloadable PDF report", "Shareable report link", "Embeddable score badge"]}
            ctaText="Get Started" onSelect={() => router.push("/")} />
          <PricingCard title="Unlimited" price="$99" period="/month"
            features={["Unlimited roasts", "Re-run audits to track progress", "Full report history dashboard", "PDF downloads on all reports", "Priority analysis queue"]}
            highlighted ctaText="Go Unlimited" onSelect={handleSubscribe} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
