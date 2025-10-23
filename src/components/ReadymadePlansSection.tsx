import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutTemplate,
  Building2,
  Sofa,
  HardHat,
} from "lucide-react";

const planTypes = [
  {
    name: "Floor Plans",
    icon: LayoutTemplate,
    image: "/floorplan.jpg",
    href: "/floor-plans",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    name: "Floor Plan + 3D Elevations",
    icon: Building2,
    image: "/3d.jpg",
    href: "/3d-plans",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    name: "Interior Designs",
    icon: Sofa,
    image: "/c3.jpeg",
    href: "/interior-designs",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
  },
  {
    name: "Home Design Product",
    icon: HardHat,
    image: "/r4.avif",
    href: "/house-designs-products",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const ReadymadePlansSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Readymade House Plans
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0">
          {/* Hide scrollbar */}
          <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; } .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

          {planTypes.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="flex-shrink-0 w-3/4 sm:w-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={plan.href}
                className="group block relative rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="relative h-full flex flex-col p-6 text-white">
                  <div className="flex-grow flex items-center justify-center">
                    <div
                      className={`p-4 sm:p-6 rounded-full ${plan.bgColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <plan.icon
                        className={`h-12 w-12 sm:h-16 sm:w-16 ${plan.iconColor}`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <h3 className="text-xl sm:text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-primary-foreground/80 opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadymadePlansSection;
