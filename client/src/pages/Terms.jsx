import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const LAST_UPDATED = "April 5, 2025";

const EMAIL = "mayurkamble0250@gmail.com";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      `By accessing or using Mindfolio ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms in their entirety, please do not use the Service. These Terms constitute a legally binding agreement between you ("User") and Mindfolio ("we," "us," or "our").`,
      `We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically to stay informed of any updates.`,
    ],
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: [
      `Mindfolio is an AI-powered personal knowledge management platform that allows users to save, organize, and retrieve various types of content including URLs, images, PDFs, and personal notes. The Service uses artificial intelligence to automatically tag, summarize, and index your saved content to enable semantic search and retrieval.`,
      `The Service is provided on an "as is" and "as available" basis. We may add, modify, or remove features at any time. We may also impose limits on certain features or restrict access to parts of the Service without notice or liability.`,
      `To access certain features, you must create an account and provide accurate, current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`,
    ],
  },
  {
    id: "data-ai",
    title: "3. User Data & AI Processing",
    content: [
      `When you submit content to Mindfolio, you grant us a limited, non-exclusive license to process that content solely for the purpose of providing the Service to you. This includes the right to transmit your content to third-party AI and processing services described below.`,
      `Your content may be processed by Mistral AI, whose large language models (LLMs) and multimodal vision models are used to generate summaries, extract entities, and create semantic embeddings from your saved items. Mistral AI processes this data according to their own data processing agreements and privacy policies. We do not use your content to train Mistral AI models.`,
      `Media files (images, PDFs) that you upload to Mindfolio are stored and served via ImageKit, a cloud-based digital asset management platform. ImageKit processes and optimizes your media files for efficient delivery. By uploading media, you acknowledge that such files will be stored on ImageKit's infrastructure.`,
      `You retain full ownership of all content you submit to the Service. You may delete your data at any time through your account settings, which will trigger deletion from our primary databases and a best-effort removal from third-party processors' systems within 30 days.`,
    ],
  },
  {
    id: "scraping",
    title: "4. Web Scraping & Copyright Liability",
    content: [
      `Mindfolio provides functionality to save and scrape content from third-party websites and social media platforms, including but not limited to Instagram. You acknowledge and agree that you are solely responsible for ensuring that your use of this functionality complies with the terms of service of the third-party platforms from which you are scraping content.`,
      `You agree not to use Mindfolio's scraping features to collect or store content in violation of any applicable copyright law, intellectual property rights, or the terms of service of any third-party website. Mindfolio is a personal productivity tool intended for users to save content they have a legitimate right to access.`,
      `We are not responsible for and expressly disclaim any liability arising from your use of the web scraping functionality in a manner that infringes on the rights of any third party. You agree to indemnify and hold harmless Mindfolio and its officers, directors, and employees from any claims arising from your misuse of these features.`,
    ],
  },
  {
    id: "liability",
    title: "5. Limitation of Liability",
    content: [
      `To the fullest extent permitted by applicable law, Mindfolio and its affiliates, officers, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.`,
      `Our total liability to you for any claim arising out of or relating to these Terms or the Service shall not exceed the greater of (a) the amounts you have paid to us in the twelve (12) months prior to the claim or (b) one hundred US dollars ($100).`,
      `Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain types of damages. Accordingly, some of the above limitations may not apply to you. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.`,
    ],
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          {/* Back link */}
          <Link
            to="/landing"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12 border-b border-border pb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Intro */}
          <p className="text-muted-foreground leading-relaxed mb-10 text-base">
            Please read these Terms of Service carefully before using Mindfolio.
            These Terms govern your access to and use of our AI-powered
            knowledge management platform. By creating an account or continuing
            to use the Service, you agree to be bound by these Terms.
          </p>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-2xl font-semibold mt-2 mb-4 text-foreground">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-muted-foreground leading-relaxed text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact footer note */}
          <div className="mt-16 pt-10 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have questions about these Terms, please contact us at{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Terms;
