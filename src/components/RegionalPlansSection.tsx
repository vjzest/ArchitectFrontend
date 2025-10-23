import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- आपकी दी गई पूरी कंट्री लिस्ट ---
const internationalPlans = [
  {
    name: "India",
    image: "https://flagcdn.com/w320/in.png",
    href: "/products?country=India",
  },
  {
    name: "Pakistan",
    image: "https://flagcdn.com/w320/pk.png",
    href: "/products?country=Pakistan",
  },
  {
    name: "Sri Lanka",
    image: "https://flagcdn.com/w320/lk.png",
    href: "/products?country=Sri Lanka",
  },
  {
    name: "Bangladesh",
    image: "https://flagcdn.com/w320/bd.png",
    href: "/products?country=Bangladesh",
  },
  {
    name: "Nepal",
    image: "https://flagcdn.com/w320/np.png",
    href: "/products?country=Nepal",
  },
  {
    name: "Myanmar",
    image: "https://flagcdn.com/w320/mm.png",
    href: "/products?country=Myanmar",
  },
  {
    name: "Afghanistan",
    image: "https://flagcdn.com/w320/af.png",
    href: "/products?country=Afghanistan",
  },
  {
    name: "Iran",
    image: "https://flagcdn.com/w320/ir.png",
    href: "/products?country=Iran",
  },
  {
    name: "Oman",
    image: "https://flagcdn.com/w320/om.png",
    href: "/products?country=Oman",
  },
  {
    name: "Tajikistan",
    image: "https://flagcdn.com/w320/tj.png",
    href: "/products?country=Tajikistan",
  },
  {
    name: "Turkmenistan",
    image: "https://flagcdn.com/w320/tm.png",
    href: "/products?country=Turkmenistan",
  },
  {
    name: "Kuwait",
    image: "https://flagcdn.com/w320/kw.png",
    href: "/products?country=Kuwait",
  },
  {
    name: "Bahrain",
    image: "https://flagcdn.com/w320/bh.png",
    href: "/products?country=Bahrain",
  },
  {
    name: "Qatar",
    image: "https://flagcdn.com/w320/qa.png",
    href: "/products?country=Qatar",
  },
  {
    name: "UAE",
    image: "https://flagcdn.com/w320/ae.png",
    href: "/products?country=UAE",
  },
  {
    name: "Yemen",
    image: "https://flagcdn.com/w320/ye.png",
    href: "/products?country=Yemen",
  },
  {
    name: "Saudi Arabia",
    image: "https://flagcdn.com/w320/sa.png",
    href: "/products?country=Saudi Arabia",
  },
  {
    name: "Austria",
    image: "https://flagcdn.com/w320/at.png",
    href: "/products?country=Austria",
  },
  {
    name: "Hungary",
    image: "https://flagcdn.com/w320/hu.png",
    href: "/products?country=Hungary",
  },
  {
    name: "Romania",
    image: "https://flagcdn.com/w320/ro.png",
    href: "/products?country=Romania",
  },
  {
    name: "France",
    image: "https://flagcdn.com/w320/fr.png",
    href: "/products?country=France",
  },
  {
    name: "Germany",
    image: "https://flagcdn.com/w320/de.png",
    href: "/products?country=Germany",
  },
  {
    name: "Netherlands",
    image: "https://flagcdn.com/w320/nl.png",
    href: "/products?country=Netherlands",
  },
  {
    name: "United Kingdom",
    image: "https://flagcdn.com/w320/gb.png",
    href: "/products?country=United Kingdom",
  },
  {
    name: "Ireland",
    image: "https://flagcdn.com/w320/ie.png",
    href: "/products?country=Ireland",
  },
  {
    name: "Norway",
    image: "https://flagcdn.com/w320/no.png",
    href: "/products?country=Norway",
  },
  {
    name: "Sweden",
    image: "https://flagcdn.com/w320/se.png",
    href: "/products?country=Sweden",
  },
  {
    name: "Finland",
    image: "https://flagcdn.com/w320/fi.png",
    href: "/products?country=Finland",
  },
  {
    name: "Spain",
    image: "https://flagcdn.com/w320/es.png",
    href: "/products?country=Spain",
  },
  {
    name: "Italy",
    image: "https://flagcdn.com/w320/it.png",
    href: "/products?country=Italy",
  },
  {
    name: "Greece",
    image: "https://flagcdn.com/w320/gr.png",
    href: "/products?country=Greece",
  },
  {
    name: "Turkey",
    image: "https://flagcdn.com/w320/tr.png",
    href: "/products?country=Turkey",
  },
  {
    name: "Portugal",
    image: "https://flagcdn.com/w320/pt.png",
    href: "/products?country=Portugal",
  },
  {
    name: "Algeria",
    image: "https://flagcdn.com/w320/dz.png",
    href: "/products?country=Algeria",
  },
  {
    name: "Libya",
    image: "https://flagcdn.com/w320/ly.png",
    href: "/products?country=Libya",
  },
  {
    name: "Niger",
    image: "https://flagcdn.com/w320/ne.png",
    href: "/products?country=Niger",
  },
  {
    name: "Mali",
    image: "https://flagcdn.com/w320/ml.png",
    href: "/products?country=Mali",
  },
  {
    name: "Chad",
    image: "https://flagcdn.com/w320/td.png",
    href: "/products?country=Chad",
  },
  {
    name: "Sudan",
    image: "https://flagcdn.com/w320/sd.png",
    href: "/products?country=Sudan",
  },
  {
    name: "Ethiopia",
    image: "https://flagcdn.com/w320/et.png",
    href: "/products?country=Ethiopia",
  },
  {
    name: "Somalia",
    image: "https://flagcdn.com/w320/so.png",
    href: "/products?country=Somalia",
  },
  {
    name: "Kenya",
    image: "https://flagcdn.com/w320/ke.png",
    href: "/products?country=Kenya",
  },
  {
    name: "Tanzania",
    image: "https://flagcdn.com/w320/tz.png",
    href: "/products?country=Tanzania",
  },
  {
    name: "Zambia",
    image: "https://flagcdn.com/w320/zm.png",
    href: "/products?country=Zambia",
  },
  {
    name: "Zimbabwe",
    image: "https://flagcdn.com/w320/zw.png",
    href: "/products?country=Zimbabwe",
  },
  {
    name: "Botswana",
    image: "https://flagcdn.com/w320/bw.png",
    href: "/products?country=Botswana",
  },
  {
    name: "South Africa",
    image: "https://flagcdn.com/w320/za.png",
    href: "/products?country=South Africa",
  },
  {
    name: "Namibia",
    image: "https://flagcdn.com/w320/na.png",
    href: "/products?country=Namibia",
  },
  {
    name: "Angola",
    image: "https://flagcdn.com/w320/ao.png",
    href: "/products?country=Angola",
  },
  {
    name: "Nigeria",
    image: "https://flagcdn.com/w320/ng.png",
    href: "/products?country=Nigeria",
  },
  {
    name: "Egypt",
    image: "https://flagcdn.com/w320/eg.png",
    href: "/products?country=Egypt",
  },
  {
    name: "DRC",
    image: "https://flagcdn.com/w320/cd.png",
    href: "/products?country=DRC",
  },
  {
    name: "Mexico",
    image: "https://flagcdn.com/w320/mx.png",
    href: "/products?country=Mexico",
  },
  {
    name: "Brazil",
    image: "https://flagcdn.com/w320/br.png",
    href: "/products?country=Brazil",
  },
  {
    name: "Chile",
    image: "https://flagcdn.com/w320/cl.png",
    href: "/products?country=Chile",
  },
  {
    name: "Argentina",
    image: "https://flagcdn.com/w320/ar.png",
    href: "/products?country=Argentina",
  },
  {
    name: "Peru",
    image: "https://flagcdn.com/w320/pe.png",
    href: "/products?country=Peru",
  },
  {
    name: "Colombia",
    image: "https://flagcdn.com/w320/co.png",
    href: "/products?country=Colombia",
  },
  {
    name: "Ecuador",
    image: "https://flagcdn.com/w320/ec.png",
    href: "/products?country=Ecuador",
  },
  {
    name: "Venezuela",
    image: "https://flagcdn.com/w320/ve.png",
    href: "/products?country=Venezuela",
  },
  {
    name: "United States",
    image: "https://flagcdn.com/w320/us.png",
    href: "/products?country=United States",
  },
  {
    name: "Canada",
    image: "https://flagcdn.com/w320/ca.png",
    href: "/products?country=Canada",
  },
  {
    name: "Iceland",
    image: "https://flagcdn.com/w320/is.png",
    href: "/products?country=Iceland",
  },
  {
    name: "Kazakhstan",
    image: "https://flagcdn.com/w320/kz.png",
    href: "/products?country=Kazakhstan",
  },
  {
    name: "China",
    image: "https://flagcdn.com/w320/cn.png",
    href: "/products?country=China",
  },
  {
    name: "Japan",
    image: "https://flagcdn.com/w320/jp.png",
    href: "/products?country=Japan",
  },
  {
    name: "Mongolia",
    image: "https://flagcdn.com/w320/mn.png",
    href: "/products?country=Mongolia",
  },
  {
    name: "Russia",
    image: "https://flagcdn.com/w320/ru.png",
    href: "/products?country=Russia",
  },
  {
    name: "Thailand",
    image: "https://flagcdn.com/w320/th.png",
    href: "/products?country=Thailand",
  },
  {
    name: "Vietnam",
    image: "https://flagcdn.com/w320/vn.png",
    href: "/products?country=Vietnam",
  },
  {
    name: "Indonesia",
    image: "https://flagcdn.com/w320/id.png",
    href: "/products?country=Indonesia",
  },
  {
    name: "Malaysia",
    image: "https://flagcdn.com/w320/my.png",
    href: "/products?country=Malaysia",
  },
  {
    name: "Philippines",
    image: "https://flagcdn.com/w320/ph.png",
    href: "/products?country=Philippines",
  },
  {
    name: "Papua New Guinea",
    image: "https://flagcdn.com/w320/pg.png",
    href: "/products?country=Papua New Guinea",
  },
  {
    name: "Australia",
    image: "https://flagcdn.com/w320/au.png",
    href: "/products?country=Australia",
  },
  {
    name: "New Zealand",
    image: "https://flagcdn.com/w320/nz.png",
    href: "/products?country=New Zealand",
  },
  {
    name: "Israel",
    image: "https://flagcdn.com/w320/il.png",
    href: "/products?country=Israel",
  },
  {
    name: "Mauritius",
    image: "https://flagcdn.com/w320/mu.png",
    href: "/products?country=Mauritius",
  },
];

const RegionalPlansSection = () => {
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            International House Plans
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-card p-2 rounded-full shadow-lg hover:bg-muted transition duration-300"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="text-foreground" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-8 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.flex.items-center.gap-8.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
            {internationalPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 text-center w-52 md:w-64"
              >
                <Link to={plan.href} className="group">
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-card p-2">
                    <img
                      src={plan.image}
                      alt={`${plan.name} flag`}
                      className="w-full h-36 md:h-48 object-contain"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {plan.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-card p-2 rounded-full shadow-lg hover:bg-muted transition duration-300"
            aria-label="Scroll Right"
          >
            <ChevronRight className="text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RegionalPlansSection;
