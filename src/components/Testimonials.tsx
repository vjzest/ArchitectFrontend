import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Vaibhav Maheshwari",
      role: "Homeowner",
      image:
        "https://img.freepik.com/free-photo/fun-3d-cartoon-illustration-indian-businessman_183364-114500.jpg",
      rating: 5,
      comment:
        "Houseplanfiles helped us design our dream house perfectly. The team was professional and the process was seamless. Highly recommended!",
    },
    {
      id: 2,
      name: "Kamesh",
      role: "Real Estate Developer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj3uMCPn30XWtrLYElm5i0Btin70LWn4YfNA&s",
      rating: 5,
      comment:
        "Outstanding architectural designs and excellent customer service. We have used their services for multiple projects and are always satisfied.",
    },
    {
      id: 3,
      name: "Shubham Sharma",
      role: "Interior Designer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtSHGuklgrqMI7ggWLm-621h29bXUGy4qMHA&s",
      rating: 5,
      comment:
        "The 3D visualizations are incredible! It really helped my clients understand the final outcome. Great attention to detail.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const activeTestimonial = testimonials[currentTestimonial];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted by thousands of satisfied customers worldwide who brought
            their dream homes to life with us.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto pt-16">
          <Card className="rounded-2xl shadow-xl overflow-visible border-2 border-transparent hover:border-orange-200 transition-colors relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              <img
                src={activeTestimonial.image}
                alt={activeTestimonial.name}
                className="w-full h-full object-cover object-top" // <-- THE CHANGE IS HERE
              />
            </div>

            <div className="p-8 md:p-12 relative text-center">
              <div className="pt-16">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-orange-100/70" />

                <div className="flex items-center justify-center mb-4">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-slate-700 mb-6 font-medium leading-relaxed">
                  "{activeTestimonial.comment}"
                </blockquote>

                <div>
                  <h4 className="text-xl font-semibold text-slate-800">
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-slate-500 mt-1">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md hover:bg-slate-100 hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md hover:bg-slate-100 hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </Button>
        </div>

        <div className="flex justify-center mt-10 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentTestimonial === index
                  ? "w-6 bg-orange-500"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
