import React from "react";
// All necessary icons are imported
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Send,
  AtSign,
  Mail,
  Phone,
} from "lucide-react";

// Custom WhatsApp Icon (no changes needed)
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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

// Custom Pinterest Icon (no changes needed)
const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" />
  </svg>
);

// --- START: UPDATED THREADS ICON ---
// This is the correct SVG for the Threads logo
const ThreadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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
// --- END: UPDATED THREADS ICON ---

const TopBar = () => {
  const contactInfo = {
    email: "houseplansdesignsfile@gmail.com",
    phone: "+919755248864",
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={16} />,
      href: "https://www.facebook.com/Houseplansndesignfiles",
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      href: `https://wa.me/${contactInfo.phone.replace("+", "")}`,
    },
    {
      name: "Twitter",
      icon: <Twitter size={16} />,
      href: "https://x.com/files22844",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={16} />,
      href: "https://www.linkedin.com/company/105681541/admin/dashboard/",
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon />,
      href: "https://pinterest.com/houseplanfiles/",
    },
    {
      name: "Telegram",
      icon: <Send size={16} />,
      href: "https://t.me/+tPzdohVcUbJiZmNl",
    },
    {
      name: "Threads",
      icon: <ThreadsIcon />,
      href: "https://www.threads.net/@house_plan_files?hl=en",
    },
    { name: "Koo", icon: <AtSign size={16} />, href: "#" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 pt-1 bg-sky-400">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-2 flex flex-col lg:flex-row lg:justify-between lg:items-center">
          {/* Left Side: Social Media Icons */}
          <div className="flex items-center gap-x-4 justify-center lg:justify-start mb-2 lg:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="text-gray-500 transition-colors hover:text-orange-500"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Center: Title Text */}
          <div className="text-center my-2 lg:my-0">
            <span className="font-semibold text-orange-500 text-sm tracking-wider">
              Future-Ready Home Design: Innovative Solutions You Need
            </span>
          </div>

          {/* Right Side: Contact Information */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-6 gap-y-1 text-sm text-gray-700">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-x-2 transition-colors hover:text-orange-500"
            >
              <Mail size={16} className="text-orange-500" />
              <span>{contactInfo.email}</span>
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-x-2 transition-colors hover:text-orange-500"
            >
              <Phone size={16} className="text-orange-500" />
              <span>{contactInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
export default TopBar;
