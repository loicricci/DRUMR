import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — DrumR",
  description:
    "The terms governing your use of DrumR, operated by Perceptron Labs.",
};

const LAST_UPDATED = "June 21, 2026";
const COMPANY = "Perceptron Labs";
const LEGAL_EMAIL = "hello@perceptron-labs.com";

const sections: LegalSection[] = [
  {
    heading: "Agreement to terms",
    body: (
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the DrumR website and application (the &ldquo;Service&rdquo;),
        operated by {COMPANY} (&ldquo;{COMPANY},&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the
        Service, joining the waitlist, or creating an account, you agree to be
        bound by these Terms. If you do not agree, do not use the Service.
      </p>
    ),
  },
  {
    heading: "Eligibility",
    body: (
      <p>
        You must be at least 18 years old, or the age of legal majority in your
        jurisdiction, and able to form a binding contract to use the Service. If
        you use the Service on behalf of an organization, you represent that you
        are authorized to bind that organization to these Terms.
      </p>
    ),
  },
  {
    heading: "Accounts",
    body: (
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity that occurs under your account. You
        agree to provide accurate information and to notify us promptly of any
        unauthorized use. We may suspend or terminate accounts that violate
        these Terms.
      </p>
    ),
  },
  {
    heading: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the Service for any unlawful or fraudulent purpose;</li>
          <li>
            Infringe the intellectual property or privacy rights of others;
          </li>
          <li>
            Upload malicious code, attempt to gain unauthorized access, or
            disrupt the integrity or performance of the Service;
          </li>
          <li>
            Reverse engineer, scrape, or resell the Service except as permitted
            by law; or
          </li>
          <li>
            Submit content that is unlawful, harmful, or that you do not have the
            right to submit.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Your content",
    body: (
      <p>
        You retain ownership of the content you submit to the Service, including
        ideas, hypotheses, personas, experiments, and other materials (&ldquo;Your
        Content&rdquo;). You grant {COMPANY} a limited, non-exclusive license to
        host, process, and use Your Content solely to operate and improve the
        Service and to generate outputs for you. You are responsible for Your
        Content and for ensuring you have the rights necessary to submit it.
      </p>
    ),
  },
  {
    heading: "AI-generated output",
    body: (
      <p>
        The Service uses AI agents to generate scores, recommendations,
        validation guidance, and reports. AI output is generated automatically,
        may be inaccurate or incomplete, and is provided for informational
        purposes only. It does not constitute professional, legal, financial,
        investment, or business advice. You are solely responsible for any
        decisions you make based on the Service, and you should independently
        verify outputs before relying on them.
      </p>
    ),
  },
  {
    heading: "Intellectual property",
    body: (
      <p>
        The Service, including its software, design, text, and branding
        (excluding Your Content), is owned by {COMPANY} and protected by
        intellectual property laws. Except as expressly permitted, you may not
        copy, modify, distribute, or create derivative works from the Service.
      </p>
    ),
  },
  {
    heading: "Third-party services",
    body: (
      <p>
        The Service may integrate with or link to third-party services. We are
        not responsible for the content, policies, or practices of third
        parties, and your use of those services is governed by their own terms.
      </p>
    ),
  },
  {
    heading: "Disclaimer of warranties",
    body: (
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, whether express or
        implied, including warranties of merchantability, fitness for a
        particular purpose, and non-infringement. We do not warrant that the
        Service will be uninterrupted, error-free, or secure, or that any output
        will be accurate or reliable.
      </p>
    ),
  },
  {
    heading: "Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by law, {COMPANY} and its affiliates
        will not be liable for any indirect, incidental, special, consequential,
        or punitive damages, or for any loss of profits, revenue, data, or
        goodwill arising from your use of the Service. Our total liability for
        any claim relating to the Service will not exceed the greater of the
        amount you paid us in the twelve months preceding the claim or USD 100.
      </p>
    ),
  },
  {
    heading: "Indemnification",
    body: (
      <p>
        You agree to indemnify and hold harmless {COMPANY} and its affiliates
        from any claims, damages, liabilities, and expenses arising out of your
        use of the Service, Your Content, or your violation of these Terms or
        applicable law.
      </p>
    ),
  },
  {
    heading: "Termination",
    body: (
      <p>
        We may suspend or terminate your access to the Service at any time, with
        or without notice, if you violate these Terms or if we discontinue the
        Service. You may stop using the Service at any time. Provisions that by
        their nature should survive termination will survive.
      </p>
    ),
  },
  {
    heading: "Changes to these terms",
    body: (
      <p>
        We may modify these Terms from time to time. When we make material
        changes, we will update the &ldquo;Last updated&rdquo; date above and,
        where appropriate, notify you. Your continued use of the Service after
        changes take effect constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    heading: "Contact us",
    body: (
      <p>
        Questions about these Terms can be sent to {COMPANY} at{" "}
        <a
          href={`mailto:${LEGAL_EMAIL}`}
          className="text-landing-accent underline-offset-4 hover:underline"
        >
          {LEGAL_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          Please read these Terms carefully before using DrumR. They form a
          binding agreement between you and {COMPANY} and govern your access to
          and use of the Service.
        </p>
      }
      sections={sections}
    />
  );
}
