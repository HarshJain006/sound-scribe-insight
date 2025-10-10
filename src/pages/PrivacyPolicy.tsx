import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="glass-effect rounded-xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: October 10, 2025</p>
          </div>

          <div className="space-y-6 text-foreground/90">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p>
                Welcome to LifeVibe Insights ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our task management application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <h3 className="text-xl font-medium mt-4">2.1 Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name and email address (when you create an account)</li>
                <li>Password (encrypted and securely stored)</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">2.2 Task and Audio Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tasks you create, including text, dates, and completion status</li>
                <li>Audio recordings you upload or record for transcription</li>
                <li>Transcribed text from audio files</li>
                <li>Usage patterns and interaction data</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">2.3 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Log data and usage statistics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your tasks and audio transcriptions</li>
                <li>Manage your account and subscription</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Data Storage and Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored on secure servers and encrypted both in transit and at rest.
              </p>
              <p className="mt-2">
                <strong>Data Retention:</strong> Free users' data is retained for 30 days. Premium users' data is retained for the duration of their subscription and 90 days after cancellation. Audio files are deleted after transcription unless explicitly saved.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our service (hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some parts of our service may not function properly without cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Third-Party Services</h2>
              <p>Our service may contain links to third-party websites or integrate with third-party services (such as Google authentication). We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our service, you consent to such transfers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">11. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">12. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-none space-y-1">
                <li>Email: privacy@lifevibe.com</li>
                <li>Website: lifevibe.com</li>
              </ul>
            </section>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                By using LifeVibe Insights, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
