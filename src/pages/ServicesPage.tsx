import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Helmet को import करें
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StandardPackagesSection from "@/components/StandardPackagesSection";
import PremiumPackagesSection from "@/components/PremiumPackagesSection";
import CorporatePackagesSection from "@/components/CorporatePackagesSection";
import {
  ChevronDown,
  Building2,
  Store,
  Factory,
  PhoneCall,
  Lightbulb,
  Handshake,
  Youtube,
  Briefcase,
  Users2,
  BrainCircuit,
  Building,
  Home,
  Sofa,
  Wrench,
  MapPin,
  Video,
  Compass,
  HardHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ==========================================================
// ✨ NUEVO: Sección de Servicios Principales (de tu chat) ✨
// ==========================================================
const coreServices = [
  { icon: Home, title: "Home Designing", link: "/contact" },
  { icon: Sofa, title: "Interior Designing", link: "/contact" },
  { icon: Building, title: "Structural Designing", link: "/contact" },
  { icon: Wrench, title: "MEP Designing and Consultation", link: "/contact" },
  {
    icon: MapPin,
    title: "Site Visit - Physical",
    isContact: true,
    link: "/contact",
  },
  {
    icon: Video,
    title: "Site Visit on Video Call",
    isContact: true,
    link: "/contact",
  },
  { icon: Compass, title: "Vastu Consultation", link: "/contact" },
  { icon: HardHat, title: "Construction Services", link: "/contact" },
];

const CoreServicesSection = () => (
  <section className="py-20 bg-soft-teal">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-foreground">
          Our Core Services
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Comprehensive solutions for every step of your project.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {coreServices.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <Link
              to={service.link}
              className="bg-card rounded-xl p-6 text-center flex flex-col items-center h-full transition-all duration-300 border-2 border-transparent group-hover:border-primary group-hover:shadow-xl group-hover:-translate-y-2"
            >
              <div className="mb-4 text-primary transition-colors duration-300">
                <service.icon size={40} />
              </div>
              <h3 className="text-lg font-bold text-foreground flex-grow">
                {service.title}
              </h3>
              {service.isContact && (
                <span className="mt-4 text-sm font-semibold text-primary">
                  Contact for Details
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Componentes específicos de esta página (FAQ, CTA) se mantienen aquí ---

const faqData = [
  {
    question: "How long does it take to get a house plan?",
    answer:
      "A standard readymade plan is delivered instantly. Custom plans typically take 2-4 weeks, depending on the complexity and number of revisions required.",
  },
  {
    question: 'What is included in the "Complete File" package?',
    answer:
      "The Complete File includes 2D floor plans, 3D elevations, structural drawings, electrical and plumbing layouts, and a bill of quantities. It's everything you need for construction.",
  },
  {
    question: "Can I make changes to a readymade plan?",
    answer:
      'Yes, you can! You can purchase a readymade plan and then opt for our "Customize Floor Plans" service to make modifications according to your needs.',
  },
  {
    question: "Do you provide construction services as well?",
    answer:
      "Currently, we specialize in architectural design and planning. We provide all the necessary drawings and support for your construction team, but we do not offer construction services directly.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (index) =>
    setOpenIndex(openIndex === index ? null : index);
  return (
    <section className="py-20 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-card rounded-lg shadow-sm overflow-hidden border border-border"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-foreground"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`transform transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-muted-foreground"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => (
  <section className="gradient-orange py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 text-center text-primary-foreground"
    >
      <h2 className="text-4xl font-bold mb-4">
        Ready to Build Your Dream Home?
      </h2>
      <p className="text-xl max-w-2xl mx-auto mb-8">
        Let's discuss your project. Contact us today for a free consultation and
        let our experts guide you.
      </p>
      <Link to="/contact">
        <Button
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold px-8 py-3 text-lg"
        >
          Get a Free Quote
        </Button>
      </Link>
    </motion.div>
  </section>
);

// --- Componente Final de la Página de Servicios ---
const ServicesPage = () => {
  return (
    <>
      {/* --- Helmet Tag for SEO --- */}
      <Helmet>
        <title>COMPLETE HOME DESIGNING SERVICES</title>
        <meta
          name="description"
          content="Get complete home designing services with 2D floor plans, 3D elevations, interiors, and turnkey solutions. Perfect designs tailored to your plot and budget"
        />
      </Helmet>

      <Navbar />
      <main>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="gradient-hero text-primary-foreground py-20 text-center"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold mb-3">
              Our Services & Packages
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Find the perfect architectural package that fits your needs, from
              standard plans to fully customized corporate solutions.
            </p>
          </div>
        </motion.section>

        <CoreServicesSection />
        <StandardPackagesSection />
        <PremiumPackagesSection />
        <CorporatePackagesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;
