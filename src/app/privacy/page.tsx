import { PageHero } from "@/components/ui/PageHero";
import { site, fullAddress } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy & HIPAA Notice",
  description: "How Oriel Dental Studio collects, uses and protects your information, including our HIPAA Notice of Privacy Practices summary.",
  path: "/privacy",
  eyebrow: "Privacy",
});

const sections: { h: string; p: string[] }[] = [
  {
    h: "A note about this website",
    p: [
      "Oriel Dental Studio is a fictional practice created by DBS Media as a website concept. Forms on this site do not send or store any information. Please don't enter real health details.",
    ],
  },
  {
    h: "Your health information is protected by law",
    p: [
      "As a dental practice, we are a covered entity under the Health Insurance Portability and Accountability Act (HIPAA). We are required to keep your protected health information (PHI) private, to give you this notice of our legal duties and privacy practices, and to follow the terms of the notice currently in effect.",
      "You'll receive our full Notice of Privacy Practices at your first visit and can request a copy at any time.",
    ],
  },
  {
    h: "How we use and share health information",
    p: [
      "Treatment: to provide and coordinate your care, including with specialists and dental laboratories.",
      "Payment: to bill you or your insurance plan and to confirm your benefits.",
      "Operations: to run the practice, for example quality reviews, staff training and appointment reminders.",
      "We never sell your health information, and we do not use it for marketing without your written permission.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can ask to see or get a copy of your records, ask us to correct them, request confidential communications (for example, texts to a different number), ask us to limit what we share, get a list of disclosures, and file a complaint with us or with the U.S. Department of Health and Human Services Office for Civil Rights. We will not retaliate against you for filing a complaint.",
    ],
  },
  {
    h: "Website information",
    p: [
      "Our website collects only the information you choose to give us in forms, plus anonymous usage data (such as pages visited) to improve the site. Booking and form data is transmitted securely and handled by HIPAA-compliant partners under business associate agreements.",
      "We don't use advertising trackers on pages that ask about your health, and we don't share website form data with social media platforms.",
    ],
  },
  {
    h: "Texts and email",
    p: [
      "If you opt in, we send appointment reminders and forms links by text or email. Message and data rates may apply. Reply STOP to opt out at any time. Standard email and SMS are not fully encrypted, so we keep clinical details out of them.",
    ],
  },
  {
    h: "Contact our privacy officer",
    p: [`Lena V., Practice Manager & Privacy Officer · ${fullAddress} · ${site.phone} · ${site.email}`, "Effective date: September 1, 2026."],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy & HIPAA"
        title={
          <>
            Your information, <em className="text-sage">handled with care.</em>
          </>
        }
        lede="A plain-English summary of how we protect your health and personal information."
        crumbs={[{ name: "Privacy", path: "/privacy" }]}
      />
      <section aria-label="Privacy policy" className="pb-28 md:pb-40">
        <div className="container-x">
          <div className="max-w-3xl space-y-14">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="display h-sm">{s.h}</h2>
                <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  {s.p.map((p) => (
                    <p key={p.slice(0, 30)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
