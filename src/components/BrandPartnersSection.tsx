import React from "react";
import { motion } from "framer-motion";

const logos = [
  {
    name: "Poperty News24.com",
    src: "/brand1.jpg",
  },
  {
    name: "Himanshu Propertie Solution",
    src: "/brand2.jpg",
  },
  {
    name: "Krispa",
    src: "/brand3.jpg",
  },
  {
    name: "Shri Laxminath Conlonizer & Developers ",
    src: "/brand4.jpg",
  },
];

// Duplicate logos for a seamless loop
const extendedLogos = [...logos, ...logos];

const BrandPartnersSection: React.FC = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -1600],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="py-16 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Brand Partners
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            We trust only the best for your home.
          </p>
        </motion.div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: [0, -1600],
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              },
            }}
          >
            {extendedLogos.map((logo, index) => (
              <div
                key={logo.name + index}
                className="flex-shrink-0 w-32 mx-8 flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-16 w-auto object-contain transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/128x64?text=Logo";
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandPartnersSection;
