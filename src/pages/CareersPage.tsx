// src/pages/CareersPage.jsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Helmet को import करें
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Briefcase,
  Building2,
  Store,
  Factory,
  Handshake,
  Users2,
  BrainCircuit,
  Lightbulb,
  Building,
  Youtube,
  Mail,
  ArrowRight,
} from "lucide-react";

// Data for the page
const jobOpenings = [
  {
    title: "Architect / Junior Architect",
    location: "Remote / On-site",
    type: "Full-time",
  },
  {
    title: "Civil Structural Engineer",
    location: "On-site",
    type: "Full-time",
  },
  { title: "Civil Design Engineer", location: "On-site", type: "Full-time" },
  {
    title: "Interior Designer",
    location: "Remote / On-site",
    type: "Full-time",
  },
  { title: "Contractor", location: "Project-based", type: "Contract" },
  {
    title: "Vastu Consultant",
    location: "Remote",
    type: "Part-time / Consultant",
  },
  { title: "Site Engineer", location: "On-site", type: "Full-time" },
  {
    title: "MEP Consultant",
    location: "Remote / On-site",
    type: "Part-time / Consultant",
  },
  {
    title: "3D Visualizer",
    icon: <Youtube size={48} className="text-orange-500" />,
    description: "High-quality 3D walkthroughs and visualization services.",
    slug: "3d-visualizer",
  },
];

const corporatePackages = [
  {
    title: "Builders & Colonizers",
    icon: <Building2 size={48} className="text-orange-500" />,
    description: "Architectural solutions for large-scale housing projects.",
    slug: "builders-colonizers",
  },
  {
    title: "Offices & Shops",
    icon: <Store size={48} className="text-orange-500" />,
    description:
      "Modern designs for commercial spaces, offices, and retail stores.",
    slug: "offices-shops",
  },
  {
    title: "Factories,Hostpital & Industires",
    icon: <Factory size={48} className="text-orange-500" />,
    description:
      "Specialized plans for industrial buildings, schools, and colleges.",
    slug: "factories-educational",
  },
  {
    title: "Franchisee",
    icon: <Handshake size={48} className="text-orange-500" />,
    description:
      "Partner with us and grow your business with our established brand.",
    slug: "franchisee",
    highlight: true,
  },

  {
    title: "Social Media / Content Creator",
    icon: <Users2 size={48} className="text-orange-500" />,
    description:
      "Collaborate with experts for digital marketing and content creation.",
    slug: "social-media",
  },
  {
    title: "Technology Expert (AI)",
    icon: <BrainCircuit size={48} className="text-orange-500" />,
    description: "Integrate cutting-edge AI and technology into your projects.",
    slug: "technology-expert",
  },
  {
    title: "Innovator (New Ideas)",
    icon: <Lightbulb size={48} className="text-orange-500" />,
    description: "Partner on new ideas and innovative product development.",
    slug: "innovator",
  },
  {
    title: "Industry Expert (Collaboration)",
    icon: <Building size={48} className="text-orange-500" />,
    description: "For Hotels, Hospitals, and other large-scale projects.",
    slug: "industry-expert",
  },
];

const CareersPage = () => {
  return (
    <div className="bg-gray-50">
      {/* --- Helmet Tag for SEO --- */}
      <Helmet>
        <title>VACANCY IN HOUSEPLANFILES</title>
        <meta
          name="description"
          content="Explore career opportunities at HousePlanFiles.com. Join our team of architects, contractors, and designers. Apply now for vacancies in home design and construction services"
        />
      </Helmet>

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
              Join & Collaborate With Us
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              We're looking for passionate individuals and businesses to help us
              shape the future of architecture.
            </p>
          </motion.div>
        </section>

        {/* --- ✨ JOB LISTINGS SECTION (RESTORED) ✨ --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Current Openings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/apply"
                    state={{ jobTitle: job.title }}
                    className="mt-auto"
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                      Apply Now
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration Opportunities Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900">
                Collaboration Opportunities
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Explore diverse ways to partner with us.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {corporatePackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-8 flex flex-col text-center items-center transition-all duration-300 border-2 ${pkg.highlight ? "border-orange-500 shadow-2xl" : "border-gray-200"} hover:border-orange-500 hover:shadow-xl hover:-translate-y-2`}
                >
                  <div className="mb-5 p-4 bg-orange-100 rounded-full">
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 flex-grow">
                    {pkg.title}
                  </h3>
                  <p className="text-gray-500 mt-2 mb-6 h-24">
                    {pkg.description}
                  </p>
                  <Link
                    to={`/corporate-inquiry/${pkg.slug}`}
                    className="mt-auto"
                  >
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
                If you have a unique proposal or an idea that doesn't fit the
                categories above, we'd love to hear from you.
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
