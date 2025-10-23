import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ✨ बदलाव यहाँ किया गया है ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // web3forms के लिए डेटा तैयार करें
    const dataToSend = {
      ...formData,
      access_key: "047f7aa7-1008-4f0e-ab62-55bea05a1449", // आपकी Access Key
      subject: "New Contact Form Submission from Your Website",
      from_name: "HousePlanFiles",
    };

    try {
      // सीधे web3forms API पर पोस्ट करें
      const response = await axios.post(
        "https://api.web3forms.com/submit",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Message sent successfully! We will get back to you soon."
        );
        setFormData({ name: "", email: "", message: "" }); // फॉर्म को रीसेट करें
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>CONTACT HOUSEPLANFILES</title>
        <meta
          name="description"
          content="Get in touch with HousePlanFiles for readymade house plans, custom designs, construction services, and consultation. Contact us today for expert support"
        />
      </Helmet>

      <Navbar />
      <div className="bg-gray-50 text-gray-800 font-sans w-full">
        <section
          className="relative py-24 md:py-32 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `url(${"https://www.oswalpumps.com/images/contact-us-banner2.jpeg"})`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Get In Touch
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-200">
              We're here to help you build your dream home. Reach out to us with
              any questions or to start your project.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
              <div className="lg:w-2/5">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-10">
                  Fill up the form and our team will get back to you within 24
                  hours. Or, reach us directly through the details below.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Address</h4>
                      <p className="text-gray-600 mt-1">
                        Bareli, Madhya Pradesh, 464668 <br /> India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faPhone} className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Phone</h4>
                      <a
                        href="tel:+919755248864"
                        className="text-gray-600 mt-1 hover:text-orange-600 transition-colors"
                      >
                        +91 97552 48864
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email</h4>
                      <a
                        href="mailto:houseplansdesignsfile@gmail.com"
                        className="text-gray-600 mt-1 hover:text-orange-600 transition-colors"
                      >
                        houseplansdesignsfile@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faTelegram} className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Telegram Channel</h4>
                      <a
                        href="https://t.me/+tPzdohVcUbJiZmNl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 mt-1 hover:text-blue-600 transition-colors"
                      >
                        Join our Telegram
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">WhatsApp Channel</h4>
                      <a
                        href="https://whatsapp.com/channel/YOUR_CHANNEL_LINK_HERE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 mt-1 hover:text-green-600 transition-colors"
                      >
                        Follow us on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-3/5 w-full">
                <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
                  <form onSubmit={handleSubmit}>
                    <div className="mt-6">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-2 text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Full Name"
                        required
                        className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-2 text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold mb-2 text-gray-700"
                      >
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      ></textarea>
                    </div>
                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="w-full h-96 md:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58930.5694269153!2d78.30452372167968!3d23.053896000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397f3b5072046f41%3A0x47f2a1b65853503a!2sBareli%2C%2C%20Madhya%20Pradesh%20464668!5e0!3m2!1sen!2sin!4v1716982970725!5m2!1sen!2sin"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
