import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 gradient-orange relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-white rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Start Your Dream Project Today!
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have built their dream homes
          with our architectural expertise.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/products">
            <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-xl shadow-large">
              Browse House Plans
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="border-2 border-white text-orange-600 bg-white/90 hover:bg-white font-semibold px-8 py-4 text-lg rounded-xl"
            >
              Contact Our Experts
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-white/80">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">10+</div>
            <div className="text-white/80">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">1000+</div>
            <div className="text-white/80">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">99%</div>
            <div className="text-white/80">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
