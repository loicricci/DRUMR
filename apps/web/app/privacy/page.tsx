import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — DrumR",
  description:
    "How Perceptron Labs collects, uses, and protects your data when you use DrumR.",
};

const LAST_UPDATED = "June 21, 2026";
const COMPANY = "Perceptron Labs";
const PRIVACY_EMAIL = "hello@perceptron-labs.com";

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: (
      <p>
        DrumR is a product operated by {COMPANY} (&ldquo;{COMPANY},&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). {COMPANY} is
        the data controller responsible for the personal data processed through
        the DrumR website and application (the &ldquo;Service&rdquo;). If you
        have any questions about this policy or how we handle your data, contact
        us at{" "}
        <a
          href={`mailto:${PRIVACY_EMAIL}`}
          className="text-landing-accent underline-offset-4 hover:underline"
        >
          {PRIVACY_EMAIL}
        </a>
        .
      </p>
    ),
  },
  {
    heading: "Information we collect",
    body: (
      <>
        <p>We collect the following categories of information:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="text-landing-fg">Information you provide.</span>{" "}
            Your email address when you join the waitlist, and account details
            (such as name and email) when you sign up, along with the content you
            create in the Service — including products, ideas, hypotheses,
            personas, experiments, and reports.
          </li>
          <li>
            <span className="text-landing-fg">Usage data.</span> How you interact
            with the Service, such as pages viewed, features used, and actions
            taken, collected to operate and improve the product.
          </li>
          <li>
            <span className="text-landing-fg">Technical data.</span> IP address,
            browser type, device information, and similar metadata collected
            automatically when you access the Service.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "How we use your information",
    body: (
      <>
        <p>We use your information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, maintain, and improve the Service;</li>
          <li>
            Manage the waitlist and notify you about early access and product
            updates;
          </li>
          <li>Authenticate you and secure your account;</li>
          <li>
            Generate AI-assisted outputs such as idea scoring, validation
            guidance, and progress reports based on the content you provide;
          </li>
          <li>Respond to your requests and provide support; and</li>
          <li>
            Comply with legal obligations and enforce our Terms of Service.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "AI processing",
    body: (
      <p>
        DrumR uses AI agents and third-party large language model providers to
        generate insights from the content you submit. Inputs you provide may be
        transmitted to these providers solely to generate outputs for you. AI
        outputs are generated automatically and may contain inaccuracies; they
        are provided for informational purposes and do not constitute
        professional, legal, financial, or business advice.
      </p>
    ),
  },
  {
    heading: "How we share information",
    body: (
      <>
        <p>
          We do not sell your personal data. We share information only with:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="text-landing-fg">Service providers</span> that help
            us operate the Service — including hosting, authentication and
            database infrastructure, analytics, email delivery, and AI model
            providers — bound by contractual confidentiality obligations;
          </li>
          <li>
            <span className="text-landing-fg">Integrations</span> you choose to
            connect, where data is shared at your direction; and
          </li>
          <li>
            <span className="text-landing-fg">Authorities</span> where required
            by law, or to protect our rights, users, or the public.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Data retention",
    body: (
      <p>
        We retain your personal data for as long as your account is active or as
        needed to provide the Service, and thereafter as required to comply with
        legal obligations, resolve disputes, and enforce our agreements. You may
        request deletion of your account and associated data at any time.
      </p>
    ),
  },
  {
    heading: "Your rights",
    body: (
      <p>
        Depending on your location, you may have the right to access, correct,
        delete, or export your personal data, to object to or restrict certain
        processing, and to withdraw consent. To exercise these rights, contact
        us at{" "}
        <a
          href={`mailto:${PRIVACY_EMAIL}`}
          className="text-landing-accent underline-offset-4 hover:underline"
        >
          {PRIVACY_EMAIL}
        </a>
        . We will respond in accordance with applicable law, including the GDPR
        and CCPA where they apply to you.
      </p>
    ),
  },
  {
    heading: "Security",
    body: (
      <p>
        We use industry-standard technical and organizational measures to
        protect your data, including encryption in transit and access controls.
        No method of transmission or storage is completely secure, so we cannot
        guarantee absolute security.
      </p>
    ),
  },
  {
    heading: "International transfers",
    body: (
      <p>
        Your data may be processed in countries other than your own. Where we
        transfer personal data internationally, we rely on appropriate
        safeguards such as standard contractual clauses to protect your
        information.
      </p>
    ),
  },
  {
    heading: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we make
        material changes, we will update the &ldquo;Last updated&rdquo; date
        above and, where appropriate, notify you. Your continued use of the
        Service after changes take effect constitutes acceptance of the updated
        policy.
      </p>
    ),
  },
  {
    heading: "Contact us",
    body: (
      <p>
        For any questions or requests regarding this Privacy Policy or your
        personal data, contact {COMPANY} at{" "}
        <a
          href={`mailto:${PRIVACY_EMAIL}`}
          className="text-landing-accent underline-offset-4 hover:underline"
        >
          {PRIVACY_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          This Privacy Policy explains how {COMPANY} collects, uses, and
          protects your personal data when you visit our website, join the
          waitlist, or use DrumR. By using the Service, you agree to the
          practices described below.
        </p>
      }
      sections={sections}
    />
  );
}
