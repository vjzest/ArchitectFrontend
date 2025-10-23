import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react"; // An icon for payment pages

const PaymentPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-soft-teal min-h-screen">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="py-5 text-center bg-background"
        >
          <div className="container mx-auto px-4">
            <CreditCard className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              Payment Policy
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
                This Payment Policy outlines the terms and conditions regarding
                payments for services provided by House Plan Files. By using our
                services or making a purchase, you agree to abide by this
                Payment Policy.
              </p>

              <h2 className="text-2xl font-bold">Payment Methods</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  We accept payment via credit/debit card, Google Pay, or other
                  payment methods specified on our website.
                </li>
                <li>
                  All payments are processed securely through our payment
                  gateway.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Service Fees</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  The fees for our services are clearly stated on our website or
                  communicated to you before the purchase.
                </li>
                <li>
                  All fees are payable in the currency specified on our website
                  and are exclusive of applicable taxes.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Payment Processing</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Payments for services are due at the time of purchase unless
                  otherwise agreed upon.
                </li>
                <li>
                  Once payment is received, we will commence the provision of
                  services as outlined in the agreement or as per our service
                  terms.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Refunds</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Refunds may be provided in accordance with our Refund Policy,
                  which is available on our website.
                </li>
                <li>
                  In exceptional cases, Requests for refunds must be submitted
                  in writing and will be processed in 48 hours in accordance
                  with our Refund Policy.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Late Payments</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  If payment is not received by the due date, we reserve the
                  right to suspend or terminate the provision of services until
                  payment is received.
                </li>
                <li>
                  Late payments may be subject to late fees or interest charges
                  as permitted by law.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Disputed Charges</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  If you believe there is an error or unauthorized charge on
                  your invoice, please notify us immediately to resolve the
                  issue.
                </li>
                <li>
                  We will investigate disputed charges promptly and provide a
                  resolution in accordance with our policies and applicable
                  laws.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Changes to Payment Policy</h2>
              <p>
                We reserve the right to update or modify this Payment Policy at
                any time without prior notice. The updated policy will be
                effective upon posting on our website.
              </p>

              <h2 className="text-2xl font-bold">Contact Us</h2>
              <p>
                If you have any questions or concerns about our Payment Policy,
                please contact us at our{" "}
                <Link to="/contact">Contact us page</Link>.
              </p>

              <p className="pt-4 border-t border-border">
                By using our services or making a purchase, you acknowledge that
                you have read, understood, and agree to abide by this Payment
                Policy.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPolicy;
