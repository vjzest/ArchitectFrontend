// src/pages/CareersPage.jsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Wrench,
  Users,
  Cpu,
  Lightbulb,
  Building,
  Youtube,
  ArrowRight,
  Mail,
} from "lucide-react";

// Data for the collaboration opportunities
const collaborationOpportunities = [
  {
    title: "Franchisee",
    description:
      "Partner with us and grow your business with our established brand.",
    icon: <Handshake className="w-10 h-10 text-orange-500" />,
    slug: "franchisee-inquiry",
    highlight: true,
  },
  {
    title: "MEP Consultant",
    description:
      "Expert consultancy for Mechanical, Electrical, and Plumbing systems.",
    icon: <Wrench className="w-10 h-10 text-orange-500" />,
    slug: "mep-consultant-inquiry",
  },
  {
    title: "Social Media / Content Creator",
    description:
      "Collaborate with experts for digital marketing and content creation.",
    icon: <Users className="w-10 h-10 text-orange-500" />,
    slug: "social-media-inquiry",
  },
  {
    title: "Technology Expert (AI)",
    description: "Integrate cutting-edge AI and technology into your projects.",
    icon: <Cpu className="w-10 h-10 text-orange-500" />,
    slug: "tech-expert-inquiry",
  },
  {
    title: "Innovator (New Ideas)",
    description: "Partner on new ideas and innovative product development.",
    icon: <Lightbulb className="w-10 h-10 text-orange-500" />,
    slug: "innovator-inquiry",
  },
  {
    title: "Industry Expert (Collaboration)",
    description: "For Hotels, Hospitals, and other larger-scale projects.",
    icon: <Building className="w-10 h-10 text-orange-500" />,
    slug: "industry-expert-inquiry",
  },
  {
    title: "3D Visualizer",
    description: "High-quality 3D walkthroughs and visualization services.",
    icon: <Youtube className="w-10 h-10 text-orange-500" />,
    slug: "3d-visualizer-inquiry",
  },
];

const CareersPage = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-24 bg-orange-50 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="container mx-auto px-4"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Partner With Us
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              We believe in collaboration. Explore opportunities to grow with us
              and shape the future of architecture.
            </p>
          </motion.div>
        </section>

        {/* Collaboration Opportunities Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Collaboration Opportunities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collaborationOpportunities.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-8 flex flex-col text-center items-center transition-all duration-300 border-2 ${job.highlight ? "border-orange-500 shadow-2xl" : "border-transparent"} hover:border-orange-500 hover:shadow-xl hover:-translate-y-2`}
                >
                  <div className="mb-5">{job.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 flex-grow">
                    {job.title}
                  </h3>
                  <p className="text-gray-500 mt-2 mb-6 h-20">
                    {job.description}
                  </p>
                  <Link to={`/inquire/${job.slug}`} className="mt-auto">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md px-6 py-3">
                      Inquire Now
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Mail className="mx-auto h-12 w-12 text-orange-400 mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Have a Different Idea?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                If you have a unique collaboration proposal or an idea that
                doesn't fit the categories above, we'd love to hear from you.
              </p>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 group"
                >
                  Contact Us{" "}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
