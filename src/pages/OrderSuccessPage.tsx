import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Download,
  FileText,
  Loader2,
  ServerCrash,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { symbol, rate } = useCurrency();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      let attempts = 0;
      const maxAttempts = 5;
      const intervalTime = 2000;

      const attemptFetch = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/guest/${orderId}`
          );
          attempts++;
          if (
            (data && data.isPaid && data.downloadableFiles?.length > 0) ||
            attempts >= maxAttempts
          ) {
            setOrder(data);
            clearInterval(interval);
            setLoading(false);
          }
        } catch (err) {
          setError(
            "Could not find your order. Please check the ID or contact support."
          );
          clearInterval(interval);
          setLoading(false);
        }
      };

      const interval = setInterval(attemptFetch, intervalTime);
      attemptFetch(); // Initial attempt right away

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    };
    fetchOrder();
  }, [orderId]);

  const handleDownloadReceipt = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Order Receipt", 14, 22);
    doc.setFontSize(11);
    doc.text(`Order ID: ${order.orderId}`, 14, 35);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 41);
    doc.text("Billed To:", 14, 51);
    doc.text(order.shippingAddress.name, 14, 57);
    doc.text(order.shippingAddress.email, 14, 63);

    autoTable(doc, {
      startY: 75,
      head: [["Item", "Quantity", "Price"]],
      body: order.orderItems.map((item: any) => [
        item.name,
        item.quantity,
        `${symbol}${(item.price * rate).toFixed(2)}`,
      ]),
      foot: [
        ["", "Subtotal", `${symbol}${(order.itemsPrice * rate).toFixed(2)}`],
        ["", "Tax", `${symbol}${(order.taxPrice * rate).toFixed(2)}`],
        [
          { content: "Total", styles: { fontStyle: "bold" } },
          "",
          {
            content: `${symbol}${(order.totalPrice * rate).toFixed(2)}`,
            styles: { fontStyle: "bold" },
          },
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: [38, 38, 38] },
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    });
    doc.save(`receipt-${order.orderId}.pdf`);
  };

  const handleDownloadProduct = async (
    fileUrl: string,
    productName: string
  ) => {
    setDownloading(productName);
    try {
      toast.info(`Starting download for ${productName}...`);
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileExtension = fileUrl.split(".").pop()?.split("?")[0] || "zip";
      const fileName = `${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`${productName} downloaded successfully!`);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error(`Failed to download ${productName}. Please try again.`);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-700">Finalizing your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-destructive">Order Not Found</h2>
        <p className="text-muted-foreground mt-2">
          {error || "The order could not be loaded."}
        </p>
        <Link to="/">
          <Button className="mt-6">Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-4xl p-4 md:p-8 my-12 bg-white rounded-lg shadow-xl border">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Thank you for your purchase. Your order is confirmed.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>Email:</strong> {order.shippingAddress.email}
            </p>
            <p>
              <strong>Total Amount:</strong>{" "}
              <DisplayPrice inrPrice={order.totalPrice} />
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Downloads</h2>
          {order.isPaid &&
          order.downloadableFiles &&
          order.downloadableFiles.length > 0 ? (
            <div className="space-y-4">
              {order.downloadableFiles.map((file: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <span className="font-medium text-gray-700">
                    {file.productName}
                  </span>
                  <Button
                    onClick={() =>
                      handleDownloadProduct(file.fileUrl, file.productName)
                    }
                    disabled={downloading === file.productName}
                  >
                    {downloading === file.productName ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download File
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Your download links are being prepared. If they don't appear,
                please refresh the page or check your email.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleDownloadReceipt}
          >
            <FileText className="mr-2 h-4 w-4" /> Download Receipt (PDF)
          </Button>
          <Link to="/products" className="w-full sm:w-auto">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccessPage;
