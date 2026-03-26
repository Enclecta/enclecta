import type { Metadata } from "next";
import QuoteWizard from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Quote — Enclecta Technology",
  description:
    "Get an instant project estimate from Enclecta. Tell us about your service needs, required features, and timeline — and we'll provide a personalised quote within seconds.",
};

export default function QuotePage() {
  return <QuoteWizard />;
}
