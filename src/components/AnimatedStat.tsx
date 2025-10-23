import CountUp from "react-countup";
import { motion } from "framer-motion";

// Yeh component ek number ko 0 se end tak animate karega
const AnimatedStat = ({ end, suffix, label }) => {
  return (
    <motion.div
      className="text-center group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors duration-300 group-hover:scale-110 transform">
        <CountUp
          end={end}
          duration={2.5} // Animation kitni der chalegi (in seconds)
          suffix={suffix}
          enableScrollSpy // Yeh tabhi start hoga jab screen par dikhega
          scrollSpyOnce={true} // Sirf ek baar animate hoga
        />
      </div>
      <div className="text-sm md:text-base text-white/80">{label}</div>
    </motion.div>
  );
};

export default AnimatedStat;
