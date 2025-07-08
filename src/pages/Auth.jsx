import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // First, try to sign in with the credentials to check if user exists
        const { data: existingUserData, error: existingUserError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (existingUserData.user) {
          // User exists and password is correct - they should login instead
          setError("This email is already registered. Please login instead.");
          toast.error("Email already registered!");
          return;
        }

        // If sign-in failed, proceed with signup
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
          },
        });

        if (signUpError) {
          // Handle specific Supabase error codes
          if (
            signUpError.message === "User already registered" ||
            signUpError.message?.includes("email_exists") ||
            signUpError.code === "email_exists" ||
            signUpError.message?.includes("already registered")
          ) {
            setError("This email is already registered. Please login instead.");
            toast.error("Email already registered!");
          } else if (signUpError.message?.includes("Invalid email")) {
            setError("Please enter a valid email address.");
            toast.error("Invalid email address!");
          } else if (signUpError.message?.includes("Password")) {
            setError("Password must be at least 6 characters long.");
            toast.error("Password too weak!");
          } else {
            setError(
              signUpError.message || "Sign up failed. Please try again."
            );
            toast.error(signUpError.message || "Sign up failed!");
          }
        } else if (data.user) {
          // Success - new user created
          toast.success(
            "Sign up successful! Check your email for verification."
          );
          setEmail("");
          setPassword("");
        } else {
          setError("Sign up failed. Please try again.");
          toast.error("Sign up failed!");
        }
      } else {
        // Login flow
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) {
          // Handle specific login errors
          if (signInError.message?.includes("Invalid login credentials")) {
            setError(
              "Invalid email or password. Please check your credentials."
            );
            toast.error("Invalid login credentials!");
          } else if (signInError.message?.includes("Email not confirmed")) {
            setError("Please check your email and confirm your account first.");
            toast.error("Email not confirmed!");
          } else {
            setError(signInError.message || "Login failed. Please try again.");
            toast.error(signInError.message || "Login failed!");
          }
        } else {
          toast.success("Login successful!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.02]">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your password"
              required
              minLength={6}
            />
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "Need an account?"}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setEmail("");
              setPassword("");
            }}
            className="text-blue-600 hover:underline font-medium ml-1"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default Auth;
