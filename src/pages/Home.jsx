import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileAlt, FaEnvelope, FaStar, FaDownload } from "react-icons/fa";

function Home({ session }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Hero Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321310764-8a5b5c3e73f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      {/* Header */}
      <header className="bg-white shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
            ResumeCraft
          </h1>
          <div className="space-x-4">
            {session ? (
              <Link
                to="/dashboard"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-indigo-600 px-4 py-2 rounded-full hover:text-indigo-800 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Create Standout Resumes & Cover Letters
        </h2>
        <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
          Build professional, ATS-optimized documents with AI-powered tools
          tailored for the Nigerian job market. Get hired faster with
          ResumeCraft.
        </p>
        <div className="mt-10 flex justify-center gap-6">
          <Link
            to={session ? "/resume" : "/auth"}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
          >
            <FaFileAlt className="mr-3" /> Build Resume
          </Link>
          <Link
            to={session ? "/cover-letter" : "/auth"}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 transition transform hover:scale-105"
          >
            <FaEnvelope className="mr-3" /> Build Cover Letter
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <h3 className="text-4xl font-bold text-gray-900 text-center">
          Why Choose ResumeCraft?
        </h3>
        <p className="mt-4 text-lg text-gray-700 text-center max-w-3xl mx-auto">
          Our platform empowers Nigerian professionals with tools to succeed in
          today's competitive job market.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Insights",
              desc: "Tailored content suggestions using advanced AI.",
              icon: FaStar,
            },
            {
              title: "Professional Templates",
              desc: "Modern, customizable designs for any industry.",
              icon: FaFileAlt,
            },
            {
              title: "Job Search Templates",
              desc: "Downloadable templates to organize your job search.",
              icon: FaDownload, // Changed icon and description
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-gray-100"
            >
              <feature.icon className="text-indigo-600 text-4xl mb-4" />
              <h4 className="text-2xl font-semibold text-gray-900">
                {feature.title}
              </h4>
              <p className="mt-3 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-indigo-100 to-purple-100 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 text-center">
            Pricing Plans
          </h3>
          <p className="mt-4 text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Start for free, upgrade for unlimited access to premium features.
            Pay securely with Paystack.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free",
                price: "₦0",
                features: [
                  "2 Resumes",
                  "1 Cover Letter",
                  "Basic Templates",
                  "AI Suggestions",
                ],
                link: "/auth",
              },
              {
                title: "Pro",
                price: "₦4,000/mo",
                features: [
                  "Unlimited Resumes",
                  "Unlimited Cover Letters",
                  "Premium Templates",
                  "Priority Support",
                ],
                link: "/checkout/pro",
              },
              {
                title: "Enterprise",
                price: "₦20,000/mo",
                features: [
                  "Unlimited Everything",
                  "Custom Branding",
                  "Team Collaboration",
                  "Dedicated Support",
                ],
                link: "/checkout/enterprise",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-gray-100"
              >
                <h4 className="text-2xl font-semibold text-gray-900">
                  {plan.title}
                </h4>
                <p className="mt-2 text-4xl font-bold text-indigo-600">
                  {plan.price}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-600 flex items-center">
                      <FaStar className="text-indigo-600 mr-2" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.link}
                  className="mt-8 w-full inline-flex justify-center px-6 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
                >
                  Choose {plan.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-white text-center">
            © 2025 ResumeCraft. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-white hover:text-indigo-300 transition">
              Privacy Policy
            </a>
            <a href="#" className="text-white hover:text-indigo-300 transition">
              Terms of Service
            </a>
            <a
              href="mailto:support@resumecraft.com"
              className="text-white hover:text-indigo-300 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
