import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react"; // An icon for privacy

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-soft-teal min-h-screen">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="py-20 text-center bg-background"
        >
          <div className="container mx-auto px-4">
            <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Last updated: 18/03/2024
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 md:p-12 rounded-2xl shadow-lg space-y-8 prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline"
            >
              <p>
                At House Plan Files, we value your privacy and are committed to
                protecting your personal information. This Privacy Policy
                outlines how we collect, use, disclose, and safeguard your
                information when you visit our website or use our services.
              </p>

              <h2 className="text-2xl font-bold">Information We Collect</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Personal Information:</strong> We may collect personal
                  information such as your name, email address, phone number,
                  and postal address when you voluntarily submit it to us
                  through our website or other communication channels.
                </li>
                <li>
                  <strong>Usage Information:</strong> We automatically collect
                  certain information about your device, including your IP
                  address, browser type, operating system, and browsing behavior
                  on our website.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies and similar tracking
                  technologies to enhance your browsing experience, analyze
                  usage patterns, and personalize content.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">
                How We Use Your Information
              </h2>
              <p>
                We may use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Providing and maintaining our services;</li>
                <li>
                  Communicating with you and responding to your inquiries;
                </li>
                <li>
                  Personalizing your experience and delivering relevant content;
                </li>
                <li>
                  Analyzing usage trends and improving our website and services;
                </li>
                <li>Preventing fraudulent activities and ensuring security.</li>
              </ul>

              <h2 className="text-2xl font-bold">
                Disclosure of Your Information
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  We may share your personal information with third-party
                  service providers who assist us in operating our website,
                  conducting our business, or servicing you.
                </li>
                <li>
                  We may also disclose your information in response to legal
                  requests, enforce our policies, or protect our rights,
                  property, or safety.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Data Retention</h2>
              <p>
                We will retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law.
              </p>

              <h2 className="text-2xl font-bold">Your Rights</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  You have the right to access, correct, or delete your personal
                  information. You may also opt out of certain data collection
                  and processing activities.
                </li>
                <li>
                  To exercise your rights or request further information about
                  our privacy practices, please contact us using the information
                  provided below.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites or
                services that are not owned or controlled by House Plan Files.
                We are not responsible for the privacy practices or content of
                such websites.
              </p>

              <h2 className="text-2xl font-bold">Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you are a parent or guardian and become aware that
                your child has provided us with personal information, please
                contact us, and we will take steps to remove such information
                from our systems.
              </p>

              <h2 className="text-2xl font-bold">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We encourage you
                to review this page periodically for the latest information on
                our privacy practices.
              </p>

              <h2 className="text-2xl font-bold">Contact Us</h2>
              <p>
                If you have any questions or concerns about our Privacy Policy
                or our data practices, please contact us at our{" "}
                <Link to="/contact">Contact us page</Link>.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
