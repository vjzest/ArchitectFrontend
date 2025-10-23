import axios from "axios";

const sendWhatsAppMessage = async (phone: string, message: string) => {
  try {
    const res = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      {
        campaignName: "Website Chatbot",
        destination: `91${phone}`,
        userName: "Visitor",
        templateParams: [message],
        source: "website",
        media: {},
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AISENSY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message Sent:", res.data);
  } catch (err: any) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
};
