import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Send,
  AtSign,
} from "lucide-react";

// --- START: ADDED CUSTOM ICONS ---

// Custom WhatsApp Icon
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

// Custom Pinterest Icon
const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64._246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" />
  </svg>
);

// --- START: CORRECTED THREADS ICON ---
// This is the correct SVG for the Threads logo
const ThreadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22a10 10 0 0 1-10-10C2 7.1 7.1 2 12 2s10 5.1 10 10c0 4.2-2.6 7.8-6.2 9.2" />
    <path d="M15.5 12c0-1.9-1.6-3.5-3.5-3.5S8.5 10.1 8.5 12c0 1.5 1 2.8 2.3 3.3" />
    <path d="M12 12v6.5" />
  </svg>
);
// --- END: CORRECTED THREADS ICON ---

// --- END: ADDED CUSTOM ICONS ---

const Footer = () => {
  // --- Updated socialLinks array with all icons ---
  const socialLinks = [
    {
      name: "Facebook",
      Icon: Facebook,
      href: "https://www.facebook.com/Houseplansndesignfiles",
    },
    {
      name: "Instagram",
      Icon: Instagram,
      href: "https://www.instagram.com/house_plan_files",
    },
    {
      name: "Twitter",
      Icon: Twitter,
      href: "https://x.com/files22844",
    },
    {
      name: "YouTube",
      Icon: Youtube,
      href: "https://www.youtube.com/@houseplansfiles8308",
    },
    {
      name: "LinkedIn",
      Icon: Linkedin,
      href: "https://www.linkedin.com/company/105681541/admin/dashboard/",
    },
    {
      name: "Pinterest",
      Icon: PinterestIcon,
      href: "https://pinterest.com/houseplanfiles/",
    },
    {
      name: "WhatsApp",
      Icon: WhatsAppIcon,
      href: "https://wa.me/919755248864",
    },
    {
      name: "Telegram",
      Icon: Send,
      href: "https://t.me/+tPzdohVcUbJiZmNl",
    },
    {
      name: "Threads",
      Icon: ThreadsIcon,
      href: "https://www.threads.net/@house_plan_files?hl=en",
    },
    {
      name: "Koo",
      Icon: AtSign,
      href: "#",
    },
  ];

  return (
    <footer className="bg-[hsl(var(--text-primary))] text-[hsl(var(--background-soft))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img
                src="/logo.png"
                alt="Houseplanfile Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold text-white">
                HousePlanFiles
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Creating exceptional architectural designs for over 15 years. Your
              dream home starts with the perfect plan.
            </p>
            <div className="flex space-x-3 flex-wrap gap-y-3">
              {socialLinks.map(({ Icon, href, name }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              {[
                { name: "Custom House Plans", href: "/products" },
                { name: "3D Visualization", href: "/services" },
                { name: "Interior Design", href: "/interior-designs" },
                { name: "Building Permits", href: "/services" },
                { name: "Construction Support", href: "/contact" },
                { name: "About", href: "/about" },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "Payment Policy", href: "/payment-policy" },
                { name: "Refund Policy", href: "/refund-policy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Blogs", href: "/blogs" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">
                  Bareli, Madhya Pradesh, 464668, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+919755248864"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 97 552 488 64
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:houseplansdesignsfile@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  houseplansdesignsfile@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-6">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} HousePlanFiles. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-white">
                We Accept:
              </span>
              <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-lg">
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png"
                  alt="Razorpay"
                  className="h-6 object-contain"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="PayPal"
                  className="h-6 object-contain"
                />
                <img
                  src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png"
                  alt="PhonePe"
                  className="h-6 object-contain"
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy-policy"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
