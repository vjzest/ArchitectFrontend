import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Store, Factory } from "lucide-react"; // Icons for each package
import { Button } from "@/components/ui/button";

// Data for the corporate packages based on your note
const corporatePackages = [
  {
    title: "Builders & Colonizers",
    icon: <Building2 size={48} className="text-primary" />,
    description:
      "Comprehensive architectural solutions for large-scale housing and colony projects.",
    slug: "builders-colonizers", // This will be passed in the URL
  },
  {
    title: "Offices & Shops",
    icon: <Store size={48} className="text-primary" />,
    description:
      "Modern and functional designs for commercial spaces, offices, and retail stores.",
    slug: "offices-shops",
  },
  {
    title: "Factories & Educational Institutions",
    icon: <Factory size={48} className="text-primary" />,
    description:
      "Specialized plans for industrial buildings, schools, colleges, and other institutions.",
    slug: "factories-educational",
  },
];

const CorporatePackagesSection = () => {
  return (
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
            Corporate Packages (Projects)
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Tailored solutions for your business and large-scale needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {corporatePackages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border-2 border-transparent rounded-xl p-8 text-center flex flex-col items-center transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-6">{pkg.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {pkg.title}
              </h3>
              <p className="text-muted-foreground flex-grow mb-6">
                {pkg.description}
              </p>

              {/* This Link will take the user to your existing inquiry form */}
              <Link to={`/corporate-inquiry/${pkg.slug}`} className="mt-auto">
                <Button className="btn-primary">Inquire Now</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporatePackagesSection;
