import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gavel } from "lucide-react"; // An icon for legal pages

const TermsAndConditions = () => {
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
            <Gavel className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              Terms & Conditions
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
                Welcome to House Plan Files! These Terms and Conditions
                (“Terms”) govern your use of our website, services, and
                applications (collectively referred to as the “Platform”). By
                accessing or using the Platform, you agree to be bound by these
                Terms. Please read them carefully before proceeding.
              </p>

              <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
              <p>
                By accessing or using the Platform, you agree to be bound by
                these Terms, our Privacy Policy, and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this site.
              </p>

              <h2 className="text-2xl font-bold">Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on House Plan Files’ website
                for personal, non-commercial transitory viewing only. This is
                the grant of a license, not a transfer of title, and under this
                license, you may not:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Modify or copy the materials;</li>
                <li>
                  Use the materials for any commercial purpose or for any public
                  display (commercial or non-commercial);
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on House Plan Files’ website;
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials; or
                </li>
                <li>
                  Transfer the materials to another person or “mirror” the
                  materials on any other server.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Disclaimer</h2>
              <p>
                The materials on House Plan Files’ website are provided on an
                ‘as is’ basis. House Plan Files makes no warranties, expressed
                or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation
                of rights.
              </p>
              <p>
                Further, House Plan Files does not warrant or make any
                representations concerning the accuracy, likely results, or
                reliability of the use of the materials on its website or
                otherwise relating to such materials or on any sites linked to
                this site.
              </p>

              <h2 className="text-2xl font-bold">Limitations</h2>
              <p>
                In no event shall House Plan Files or its suppliers be liable
                for any damages (including, without limitation, damages for loss
                of data or profit, or due to business interruption) arising out
                of the use or inability to use the materials on House Plan
                Files’ website, even if House Plan Files or a House Plan Files
                authorized representative has been notified orally or in writing
                of the possibility of such damage. Because some jurisdictions do
                not allow limitations on implied warranties, or limitations of
                liability for consequential or incidental damages, these
                limitations may not apply to you.
              </p>

              <h2 className="text-2xl font-bold">Accuracy of Materials</h2>
              <p>
                The materials appearing on House Plan Files’ website could
                include technical, typographical, or photographic errors. House
                Plan Files does not warrant that any of the materials on its
                website are accurate, complete, or current. House Plan Files may
                make changes to the materials contained on its website at any
                time without notice. However, House Plan Files does not make any
                commitment to update the materials.
              </p>

              <h2 className="text-2xl font-bold">Links</h2>
              <p>
                House Plan Files has not reviewed all of the sites linked to its
                website and is not responsible for the contents of any such
                linked site. The inclusion of any link does not imply
                endorsement by House Plan Files of the site. Use of any such
                linked website is at the user’s own risk.
              </p>

              <h2 className="text-2xl font-bold">Modifications</h2>
              <p>
                House Plan Files may revise these terms of service for its
                website at any time without notice. By using this website, you
                are agreeing to be bound by the then-current version of these
                terms of service.
              </p>

              <h2 className="text-2xl font-bold">Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of India and you irrevocably submit to
                the exclusive jurisdiction of the courts in that State or
                location.
              </p>

              <p className="pt-4">
                If you have any questions or concerns about these Terms and
                Conditions, please contact us at our{" "}
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

export default TermsAndConditions;
