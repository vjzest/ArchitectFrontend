import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Corner house plans",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/category/corner-house",
  },
  {
    name: "Duplex",
    image:
      "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/category/duplex",
  },
  {
    name: "Bungalows",
    image:
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/category/bungalows",
  },
  {
    name: "Apartments Of Flats",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/category/apartments",
  },
  {
    name: "Classic House",
    image:
      "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/category/classic-house",
  },
  {
    name: "Modern Villa",
    image:
      "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/category/modern-villa",
  },
];

const CategoriesSection = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Categories
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-card p-2 rounded-full shadow-md hover:bg-muted transition"
          >
            <ChevronLeft className="text-foreground" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-8 overflow-x-auto pb-4"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            <style>{`.flex.items-stretch.gap-8.overflow-x-auto.pb-4::-webkit-scrollbar { display: none; }`}</style>

            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-64"
              >
                <Link to={category.href} className="group flex flex-col h-full">
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-4 text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-card p-2 rounded-full shadow-md hover:bg-muted transition"
          >
            <ChevronRight className="text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
