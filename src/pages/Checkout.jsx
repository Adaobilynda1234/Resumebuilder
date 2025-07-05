import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Checkout({ session }) {
  const { plan } = useParams();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPaystackScript = (retries = 3, delay = 1000) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => {
        if (window.PaystackPop) {
          setScriptLoaded(true);
          setScriptError(null);
        } else {
          setScriptError(
            "Paystack script loaded but PaystackPop is unavailable."
          );
        }
      };
      script.onerror = () => {
        if (retries > 0) {
          setTimeout(() => loadPaystackScript(retries - 1, delay * 2), delay);
        } else {
          setScriptError(
            "Failed to load Paystack script after retries. Please check your network."
          );
        }
      };
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    loadPaystackScript();
  }, []);

  const handlePaystackPayment = async () => {
    if (!session) {
      alert("Please log in to proceed with payment.");
      window.location.href = "/auth";
      return;
    }

    if (!scriptLoaded || !window.PaystackPop) {
      alert("Paystack is not loaded. Please try again or check your network.");
      return;
    }

    setIsLoading(true);

    // Set a fallback timeout to reset loading state after 30 seconds
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      console.warn("Payment timeout - resetting loading state");
    }, 30000);

    try {
      const amount = plan === "pro" ? 400000 : 2000000; // ₦4,000 or ₦20,000 in kobo
      const planName = plan === "pro" ? "Pro" : "Enterprise";

      // Fix: Call PaystackPop as a function, not as a constructor
      const paystack = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: session.user.email,
        amount,
        currency: "NGN",
        metadata: { plan: planName },
        onSuccess: async (transaction) => {
          clearTimeout(timeoutId);
          console.log("Payment successful:", transaction);
          try {
            const { data, error } = await supabase
              .from("subscriptions")
              .insert({
                user_id: session.user.id,
                plan: planName,
                paystack_reference: transaction.reference,
              });

            if (error) {
              console.error("Supabase error:", error);
              alert(
                "Payment successful but failed to save subscription. Please contact support."
              );
            } else {
              console.log("Subscription saved:", data);
              alert(
                `Payment successful for ${planName} plan! Reference: ${transaction.reference}`
              );
            }
          } catch (error) {
            console.error("Error saving subscription:", error);
            alert(
              "Payment successful but failed to save subscription. Please contact support."
            );
          } finally {
            setIsLoading(false);
          }
        },
        onCancel: () => {
          clearTimeout(timeoutId);
          console.log("Payment cancelled");
          alert("Payment cancelled.");
          setIsLoading(false);
        },
        onError: (error) => {
          clearTimeout(timeoutId);
          console.error("Payment error:", error);
          alert(`Payment error: ${error.message || "Unknown error occurred"}`);
          setIsLoading(false);
        },
        onClose: () => {
          // This callback is triggered when the payment modal is closed
          clearTimeout(timeoutId);
          console.log("Payment modal closed");
          setIsLoading(false);
        },
      });

      // Open the Paystack payment modal
      paystack.openIframe();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
    >
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-indigo-100">
        <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          {plan === "pro" ? "Pro Plan Checkout" : "Enterprise Plan Checkout"}
        </h2>
        <p className="text-gray-600 mb-6">
          Subscribe to the{" "}
          {plan === "pro"
            ? "Pro Plan for ₦4,000/month"
            : "Enterprise Plan for ₦20,000/month"}{" "}
          and unlock{" "}
          {plan === "pro"
            ? "unlimited resumes, cover letters, and premium templates"
            : "unlimited everything, custom branding, team collaboration, and dedicated support"}
          . Pay securely with Paystack.
        </p>
        {scriptError && <p className="text-red-500 mb-4">{scriptError}</p>}
        <motion.button
          whileHover={{ scale: scriptLoaded && !isLoading ? 1.05 : 1 }}
          whileTap={{ scale: scriptLoaded && !isLoading ? 0.95 : 1 }}
          onClick={handlePaystackPayment}
          disabled={!scriptLoaded || isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center ${
            scriptLoaded && !isLoading
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Processing...
            </>
          ) : scriptLoaded ? (
            "Pay with Paystack"
          ) : (
            "Loading Paystack..."
          )}
        </motion.button>
        <Link
          to="/"
          className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default Checkout;
