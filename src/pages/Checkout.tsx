import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { RootState, AppDispatch } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";
import {
  createOrder,
  payOrderWithPaypal,
  resetCurrentOrder,
} from "@/lib/features/orders/orderSlice";
import useExternalScripts from "@/hooks/usePaymentGateway";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";
import { Checkbox } from "@/components/ui/checkbox"; // Agar shadcn/ui use kar rahe hain to aese import karein, varna normal <input type="checkbox"> use karein. Main abhi normal input use kar raha hu taki dependency na badhe.

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const { loaded: isRazorpayLoaded } = useExternalScripts([
    "https://checkout.razorpay.com/v1/checkout.js",
  ]);

  const { state: cartState, clearCart } = useCart();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const {
    currentOrder,
    status: orderStatus,
    error: orderError,
  } = useSelector((state: RootState) => state.orders);

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [paypalClientId, setPaypalClientId] = useState("");
  const [isPaypalSdkReady, setIsPaypalSdkReady] = useState(false);
  // --- START: NEW STATE ADDED ---
  const [termsAccepted, setTermsAccepted] = useState(false);
  // --- END: NEW STATE ADDED ---

  const orderSummary = useMemo(() => {
    if (!cartState.items || cartState.items.length === 0) {
      return { subtotal: 0, totalTax: 0, shipping: 0, finalTotal: 0 };
    }

    let subtotal = 0;
    let totalTax = 0;

    cartState.items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      const taxRate = (item.taxRate || 0) / 100;
      totalTax += itemSubtotal * taxRate;
    });

    const shipping = 0;
    const finalTotal = subtotal + totalTax + shipping;

    return { subtotal, totalTax, shipping, finalTotal };
  }, [cartState.items]);

  useEffect(() => {
    const fetchPaypalId = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/paypal/client-id`
        );
        if (data.clientId) {
          setPaypalClientId(data.clientId);
          setIsPaypalSdkReady(true);
        }
      } catch (error) {
        console.error("Could not fetch PayPal Client ID", error);
      }
    };
    fetchPaypalId();

    if (userInfo) {
      reset({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || "",
      });
    }

    if (cartState.items.length === 0 && !cartState.loading) {
      toast.info("Your cart is empty. Redirecting...");
      navigate("/cart");
    }

    dispatch(resetCurrentOrder());
  }, [
    userInfo,
    navigate,
    cartState.items.length,
    dispatch,
    reset,
    cartState.loading,
  ]);

  const getAuthConfig = () => {
    const config: { headers: { [key: string]: string } } = { headers: {} };
    if (userInfo?.token) {
      config.headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
    return config;
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Your order is confirmed.");
    const latestOrderId = localStorage.getItem("latestOrderId");
    clearCart();
    localStorage.removeItem("latestOrderId");

    if (latestOrderId) {
      navigate(`/order-success/${latestOrderId}`);
    } else {
      navigate("/dashboard/orders");
    }
  };

  const handleRazorpayPayment = async (order: any) => {
    if (!isRazorpayLoaded) {
      toast.error("Razorpay is not ready. Please wait.");
      return;
    }
    try {
      const authConfig = getAuthConfig();
      const { data: razorpayOrderData } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/create-razorpay-order`,
        {},
        authConfig
      );
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "Houseplanfiles",
        order_id: razorpayOrderData.orderId,
        handler: async (response: any) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/verify-payment`,
              response,
              authConfig
            );
            handlePaymentSuccess();
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: order.shippingAddress.name,
          email: order.shippingAddress.email,
          contact: order.shippingAddress.phone,
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Failed to start Razorpay payment.");
    }
  };

  const handlePhonePePayment = async (order: any) => {
    try {
      const authConfig = getAuthConfig();
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/create-phonepe-payment`,
        {},
        authConfig
      );
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Could not get PhonePe payment URL.");
      }
    } catch (err) {
      toast.error("Failed to start PhonePe payment.");
    }
  };

  const onPaypalApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      dispatch(
        payOrderWithPaypal({
          orderId: currentOrder._id,
          paymentResult: details,
        })
      ).then((result) => {
        if (payOrderWithPaypal.fulfilled.match(result)) {
          handlePaymentSuccess();
        } else {
          toast.error("PayPal payment failed.");
        }
      });
    });
  };

  const createPaypalOrder = (data: any, actions: any) => {
    if (!currentOrder || !currentOrder.totalPrice) {
      toast.error("Order details not available. Please try again.");
      return Promise.reject(new Error("Order details not available"));
    }
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (currentOrder.totalPrice / 82).toFixed(2),
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onSubmit = (data: any) => {
    const orderData = {
      orderItems: cartState.items,
      shippingAddress: data,
      paymentMethod,
      itemsPrice: orderSummary.subtotal,
      taxPrice: orderSummary.totalTax,
      shippingPrice: orderSummary.shipping,
      totalPrice: orderSummary.finalTotal,
    };

    dispatch(createOrder(orderData)).then((res) => {
      if (createOrder.fulfilled.match(res)) {
        const createdOrder = res.payload;
        localStorage.setItem("latestOrderId", createdOrder.orderId);
        if (paymentMethod === "Razorpay") handleRazorpayPayment(createdOrder);
        else if (paymentMethod === "PhonePe")
          handlePhonePePayment(createdOrder);
      } else {
        toast.error(String(orderError) || "Could not create order.");
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/cart")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Button>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Billing Information
              </h2>
              <form
                id="shipping-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Full name is required" })}
                    defaultValue={userInfo?.name}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    defaultValue={userInfo?.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    defaultValue={userInfo?.phone}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="e.g., City, State"
                  />
                </div>
              </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  {
                    name: "Razorpay",
                    imgSrc:
                      "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png",
                    imgClass: "h-10",
                  },
                  {
                    name: "PayPal",
                    imgSrc:
                      "https://www.citypng.com/public/uploads/preview/transparent-hd-paypal-logo-701751694777788ilpzr3lary.png",
                    imgClass: "h-10",
                  },
                  {
                    name: "PhonePe",
                    imgSrc:
                      "https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png",
                    imgClass: "h-10",
                  },
                ].map((method) => (
                  <label
                    key={method.name}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === method.name ? "border-primary bg-primary/5 ring-2 ring-primary" : "hover:border-gray-400"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.name}
                      checked={paymentMethod === method.name}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{method.name}</span>
                      <img
                        src={method.imgSrc}
                        alt={`${method.name} logo`}
                        className={method.imgClass}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            <div className="space-y-2">
              {cartState.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center text-sm py-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <span className="block">{item.name}</span>
                      <span className="text-gray-500">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="font-semibold">
                    <DisplayPrice inrPrice={item.price * item.quantity} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t my-4"></div>
            <div className="space-y-2 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  <DisplayPrice inrPrice={orderSummary.subtotal} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {orderSummary.shipping === 0 ? (
                    "FREE"
                  ) : (
                    <DisplayPrice inrPrice={orderSummary.shipping} />
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>
                  <DisplayPrice inrPrice={orderSummary.totalTax} />
                </span>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  <DisplayPrice inrPrice={orderSummary.finalTotal} />
                </span>
              </div>
            </div>

            {/* --- START: NEW CHECKBOX AND LINK ADDED --- */}
            <div className="flex items-start space-x-2 mt-6">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I have read and agree to the website's{" "}
                <Link
                  to="/terms"
                  target="_blank" // Naye tab me kholne ke liye
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Terms and Conditions
                </Link>
                .
              </label>
            </div>
            {/* --- END: NEW CHECKBOX AND LINK ADDED --- */}

            <div className="mt-6">
              {paymentMethod === "PayPal" ? (
                isPaypalSdkReady ? (
                  <PayPalScriptProvider
                    options={{ "client-id": paypalClientId, currency: "USD" }}
                  >
                    {!currentOrder ? (
                      <Button
                        type="submit"
                        form="shipping-form"
                        // --- START: MODIFIED DISABLED LOGIC ---
                        disabled={orderStatus === "loading" || !termsAccepted}
                        // --- END: MODIFIED DISABLED LOGIC ---
                        className="w-full mb-2"
                      >
                        {orderStatus === "loading" && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        1. Save Information to Pay
                      </Button>
                    ) : (
                      <div>
                        <p className="text-sm text-center text-gray-600 mb-2">
                          Info saved. Complete payment below.
                        </p>
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={createPaypalOrder}
                          onApprove={onPaypalApprove}
                          onError={(err) =>
                            toast.error("PayPal encountered an error.")
                          }
                        />
                      </div>
                    )}
                  </PayPalScriptProvider>
                ) : (
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="text-sm mt-2">Loading PayPal...</p>
                  </div>
                )
              ) : (
                <Button
                  type="submit"
                  form="shipping-form"
                  className="w-full btn-primary py-3 text-lg"
                  // --- START: MODIFIED DISABLED LOGIC ---
                  disabled={
                    orderStatus === "loading" ||
                    (paymentMethod === "Razorpay" && !isRazorpayLoaded) ||
                    !termsAccepted
                  }
                  // --- END: MODIFIED DISABLED LOGIC ---
                >
                  {orderStatus === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Pay with {paymentMethod}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CheckoutPage;
