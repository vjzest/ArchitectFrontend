import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutTemplate, Building2, Sofa, Video } from "lucide-react";

const customServices = [
  {
    name: "Customize Floor Plans",
    description:
      "Tailor any floor plan to match your exact needs and lifestyle.",
    image: "/cutomizefloor.jpg",
    icon: LayoutTemplate,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
    href: "/customize/floor-plans",
  },
  {
    name: "Customize Floor Plan + 3D Elevation",
    description:
      "Modify the exterior look of your home with custom 3D renders.",
    image: "/floor+3d.jpg",
    icon: Building2,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
    href: "/customize/3d-elevation",
  },
  {
    name: "Complete House Plan File",
    description:
      "Personalize your living spaces with our expert interior designers.",
    image: "/completehouse.jpg",
    icon: Sofa,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
    href: "/customize/interior-designs",
  },
  {
    name: "3D Elevation and Video WalkThrough",
    description:
      "Experience your future home with immersive 3D video walkthroughs.",
    image: "/elevation3d.jpg",
    icon: Video,
    bgColor: "bg-red-100",
    iconColor: "text-red-500",
    href: "/customize/3d-video-walkthrough",
  },
];

const CustomDesignSection = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            We Design with Your Requirements
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        {/* --- मुख्य बदलाव यहाँ है --- */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0 max-w-7xl mx-auto">
          {/* Hide scrollbar */}
          <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; } .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

          {customServices.map((service, index) => (
            <motion.div
              key={service.name}
              className="flex-shrink-0 w-3/4 sm:w-2/5 md:w-auto" // मोबाइल के लिए कार्ड की चौड़ाई
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={service.href} className="group block h-full">
                <div className="bg-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/30">
                      <div
                        className={`p-4 rounded-full ${service.bgColor} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <service.icon
                          className={`w-12 h-12 ${service.iconColor}`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
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

export default CustomDesignSection;
