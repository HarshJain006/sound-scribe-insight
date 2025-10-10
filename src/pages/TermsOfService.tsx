import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: October 10, 2025</p>
          </div>

          <div className="space-y-6 text-foreground/90">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
              <p>
                By accessing or using LifeVibe Insights ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Description of Service</h2>
              <p>
                LifeVibe Insights is a task management application that provides:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Task creation, organization, and tracking</li>
                <li>Audio recording and transcription services</li>
                <li>Calendar integration for task scheduling</li>
                <li>Task history and analytics</li>
                <li>Free and Premium subscription tiers</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <h3 className="text-xl font-medium mt-4">3.1 Account Creation</h3>
              <p>
                To use certain features of our Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">3.2 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Subscription Plans</h2>
              <h3 className="text-xl font-medium mt-4">4.1 Free Plan</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>7 tasks per day limit</li>
                <li>3 audio transcriptions per day</li>
                <li>30-day data retention</li>
                <li>Basic features access</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">4.2 Premium Plan (₹149/month)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Unlimited tasks and audio transcriptions</li>
                <li>Unlimited data retention</li>
                <li>Priority support</li>
                <li>Advanced features and analytics</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">4.3 Billing</h3>
              <p>
                Premium subscriptions are billed monthly. You will be charged at the beginning of each billing cycle. All fees are non-refundable except as required by law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Acceptable Use Policy</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service to harass, abuse, or harm others</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data about other users</li>
                <li>Use automated systems or bots without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Intellectual Property Rights</h2>
              <h3 className="text-xl font-medium mt-4">6.1 Our Rights</h3>
              <p>
                The Service and its original content, features, and functionality are owned by LifeVibe Insights and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-medium mt-4">6.2 Your Content</h3>
              <p>
                You retain all rights to the content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and process your content solely to provide the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Data and Privacy</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy. Please review our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> to understand our practices.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Service Availability</h2>
              <p>
                We strive to provide uninterrupted service, but we do not guarantee that the Service will be available at all times. We may experience hardware, software, or other problems that could lead to interruptions, delays, or errors. We reserve the right to modify or discontinue the Service at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, LifeVibe Insights shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">10. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless LifeVibe Insights and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">12. Cancellation and Refunds</h2>
              <h3 className="text-xl font-medium mt-4">12.1 Cancellation</h3>
              <p>
                You may cancel your Premium subscription at any time. Upon cancellation, you will continue to have access to Premium features until the end of your current billing period.
              </p>

              <h3 className="text-xl font-medium mt-4">12.2 Refunds</h3>
              <p>
                All subscription fees are non-refundable except as required by applicable law. If you cancel your subscription, you will not receive a refund for the current billing period.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">13. Modifications to Service and Terms</h2>
              <p>
                We reserve the right to modify or discontinue the Service at any time with or without notice. We also reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in India.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">15. Dispute Resolution</h2>
              <p>
                If a dispute arises between you and LifeVibe Insights, we strongly encourage you to first contact us directly to seek a resolution. We will consider reasonable requests to resolve the dispute through alternative dispute resolution procedures, such as mediation or arbitration.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">17. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <ul className="list-none space-y-1">
                <li>Email: support@lifevibe.com</li>
                <li>Website: lifevibe.com</li>
              </ul>
            </section>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                By using LifeVibe Insights, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
