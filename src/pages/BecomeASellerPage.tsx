import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const BecomeASellerPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-poppins">
      <div className="bg-card text-foreground p-8 sm:p-10 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Become a seller</h1>

        <form>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold mb-2"
              >
                Username <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <fieldset className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="customer"
                  name="user-role"
                  value="customer"
                  className="h-4 w-4 text-primary focus:ring-primary border-border"
                  defaultChecked
                />
                <label htmlFor="customer" className="text-sm">
                  I am a customer
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="vendor"
                  name="user-role"
                  value="vendor"
                  className="h-4 w-4 text-primary focus:ring-primary border-border"
                />
                <label htmlFor="vendor" className="text-sm">
                  I am a vendor
                </label>
              </div>
            </fieldset>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                className="h-4 w-4 rounded text-primary focus:ring-primary border-border"
                defaultChecked
              />
              <label htmlFor="newsletter" className="text-sm">
                Subscribe to our newsletter
              </label>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              privacy policy
            </Link>
            .
          </p>

          <Button
            type="submit"
            className="w-full mt-6 text-base font-bold py-3"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BecomeASellerPage;
