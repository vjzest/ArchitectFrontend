import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredPlans = [
  {
    id: 1,
    title: "Modern Minimalist Villa",
    dimensions: "2400 sqft",
    image: "https://i.imgur.com/G5g20vX.png",
    isSale: true,
    hasVideo: true,
    youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID_HERE_1",
    plotArea: "2400 SQFT",
    rooms: "3 BHK",
    bathrooms: "3",
    kitchen: "1",
    originalPrice: 99999.0,
    salePrice: 89999.0,
    reviews: 124,
  },
  {
    id: 2,
    title: "Contemporary Family Home",
    dimensions: "3200 sqft",
    image: "https://i.imgur.com/7bUvP7s.png",
    isSale: true,
    hasVideo: false,
    plotArea: "3200 sqft",
    rooms: "4 BHK",
    bathrooms: "3",
    kitchen: "1",
    originalPrice: 139999.0,
    salePrice: 124999.0,
    reviews: 89,
  },
  {
    id: 3,
    title: "Luxury Mediterranean Villa",
    dimensions: "4500 sqft",
    image: "https://i.imgur.com/zN0n2fL.png",
    isSale: true,
    hasVideo: true,
    youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID_HERE_2",
    plotArea: "4500 SQFT",
    rooms: "5 BHK",
    bathrooms: "4",
    kitchen: "1",
    originalPrice: 219999.0,
    salePrice: 199999.0,
    reviews: 156,
  },
];

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-background-soft p-2 rounded-md text-left">
    <p className="text-xs text-text-muted">{label}</p>
    <p className="font-semibold text-text-primary">{value}</p>
  </div>
);

const FeaturedPlansSection = () => {
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
            Featured House Plans
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and award-winning architectural designs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="relative overflow-hidden border-b border-border">
                <Link to={`/product/${plan.id}`}>
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                </Link>

                {/* --- YEH SECTION THEEK KIYA GAYA HAI --- */}
                {plan.isSale &&
                  (plan.hasVideo && plan.youtubeLink ? (
                    // Agar video hai, toh link ke saath RED badge
                    <a
                      href={plan.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 hover:bg-red-600 transition-colors"
                    >
                      <span>Sale!</span>
                      <Youtube size={14} />
                    </a>
                  ) : (
                    // Agar video nahi hai, toh sirf non-clickable RED badge
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10">
                      <span>Sale!</span>
                    </div>
                  ))}

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-center text-sm font-bold">
                  <span>{plan.dimensions} House plan</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <SpecItem label="Plot Area" value={plan.plotArea} />
                  <SpecItem label="Rooms" value={plan.rooms} />
                  <SpecItem label="Bathrooms" value={plan.bathrooms} />
                  <SpecItem label="Kitchen" value={plan.kitchen} />
                </div>

                <h3 className="text-lg font-bold text-foreground text-left">
                  {plan.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 text-left">
                  {plan.dimensions}
                </p>

                <div className="flex items-baseline gap-3 mb-5 text-left">
                  {plan.isSale && (
                    <s className="text-muted-foreground">
                      ₹{plan.originalPrice.toLocaleString("en-IN")}
                    </s>
                  )}
                  <span className="text-2xl font-extrabold text-primary">
                    ₹{plan.salePrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {plan.reviews} reviews
                    </span>
                  </div>
                  <Link
                    to={`/product/${plan.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mt-auto space-y-3">
                  <Button className="w-full bg-accent hover:bg-accent-light text-accent-foreground">
                    Add to cart
                  </Button>
                  <Link to={`/product/${plan.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-10">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlansSection;
