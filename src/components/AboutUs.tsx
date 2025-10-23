import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  Target,
  Building,
  Users,
  Handshake,
  Lightbulb,
  Bot,
  Construction,
  Store,
  ArrowRight,
  TrendingUp,
  Group,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "Himanshu Vyas",
    title: "Founder & CEO",
    image: "/founder.jpg",
  },
  // आप चाहें तो भविष्य में और टीम मेंबर्स यहाँ जोड़ सकते हैं
  // {
  //   name: "Priya Verma",
  //   title: "Head of Sales",
  //   image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop",
  // },
];

const corePillars = [
  {
    icon: Lightbulb,
    title: "Design Innovation",
    description:
      "Thousands of readymade house plans, AI-powered customization, and immersive VR/3D walkthroughs.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: Construction,
    title: "Construction Integration",
    description:
      "Verified local contractors, turnkey solutions from foundation to finishing, and transparent quality checks.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    icon: Store,
    title: "Marketplace & Services",
    description:
      "Partnered material suppliers, interior designers, landscape experts, and financing assistance.",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
  },
  {
    icon: Bot,
    title: "Technology Backbone",
    description:
      "A mobile-first platform integrating AI, AR/VR & BIM for modern, accessible home solutions.",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const vision2030Goals = [
  { icon: Users, text: "Serve 10M+ homeowners across 50+ countries." },
  {
    icon: Handshake,
    text: "Onboard 100K+ architects, engineers, and contractors.",
  },
  {
    icon: Store,
    text: "Become the world’s largest digital home design-to-construction marketplace.",
  },
  {
    icon: Group,
    text: "Create trusted communities for transparent collaboration.",
  },
];

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-24 text-center">
          <div className="container mx-auto px-4 animate-fade-in">
            <Globe
              className="w-16 h-16 text-primary mx-auto mb-4"
              strokeWidth={1.5}
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Our Vision
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              “To build a global ecosystem where home designing and home
              construction come together on a single digital platform —
              empowering people worldwide to design, customize, and construct
              their dream homes seamlessly, affordably, and with trust.”
            </p>
          </div>
        </section>

        {/* The Big Picture Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-right">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">The Big Picture</h2>
              <p className="text-muted-foreground text-lg mb-6">
                HousePlanFiles.com is more than just a house plan store. We aim
                to become the “Amazon of Home Designing & Construction”, where
                anyone, anywhere can:
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary" /> Explore
                  ready-made plans.
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary" /> Customize
                  layouts & interiors.
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary" /> Hire verified
                  professionals.
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary" /> Buy building
                  materials.
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary" /> Track their
                  project digitally.
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-left">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500"
                alt="A modern architectural home"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Core Pillars Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">
              Core Pillars of Our Ecosystem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {corePillars.map((pillar, index) => (
                <Card
                  key={index}
                  className="text-left p-6 group hover:shadow-card-hover transition-shadow duration-300 animate-fade-in border-0 shadow-soft"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-0">
                    <div
                      className={`w-16 h-16 ${pillar.bgColor} rounded-lg flex items-center justify-center mb-5`}
                    >
                      <pillar.icon
                        className={`w-8 h-8 ${pillar.iconColor}`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- Meet Our Leadership Section (Founder Centered) --- */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Meet Our Leadership</h2>
            <div className="grid grid-cols-1 max-w-4xl mx-auto justify-center">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="text-center group hover:shadow-card-hover transition-shadow duration-300 animate-fade-in border-0 shadow-soft"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                    />
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-primary font-semibold text-lg">
                      {member.title}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Global Vision 2030 Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Global Vision 2030</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12">
              By 2030, HousePlanFiles.com will achieve the following milestones:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vision2030Goals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg shadow-sm text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <goal.icon
                    className="w-10 h-10 text-primary mx-auto mb-4"
                    strokeWidth={1.5}
                  />
                  <p className="font-semibold text-foreground">{goal.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Matters Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <Building className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Why This Matters</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Today, homeowners face fragmented services. HousePlanFiles.com is
              solving this gap by creating a one-stop global hub, reducing
              complexity, saving costs, and building homes with trust.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
