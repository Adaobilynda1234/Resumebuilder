import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileAlt, FaEnvelope, FaStar } from "react-icons/fa";

function Home({ session }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">ResumeBuilder</h1>
          <div>
            {session ? (
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="text-blue-600 hover:text-blue-800">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Craft Your Perfect Resume & Cover Letter
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Build professional, ATS-optimized resumes and cover letters with
          AI-powered assistance in minutes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/resume"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaFileAlt className="mr-2" /> Build Resume
          </Link>
          <Link
            to="/cover-letter"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
          >
            <FaEnvelope className="mr-2" /> Build Cover Letter
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-gray-900 text-center">
          Why Choose Us?
        </h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered",
              desc: "Leverage AI to generate tailored content.",
              icon: FaStar,
            },
            {
              title: "Customizable",
              desc: "Multiple templates and styling options.",
              icon: FaFileAlt,
            },
            {
              title: "Secure Storage",
              desc: "Safely store resumes with Supabase.",
              icon: FaEnvelope,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <feature.icon className="text-blue-600 text-3xl mb-4" />
              <h4 className="text-xl font-semibold">{feature.title}</h4>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Pricing Plans
          </h3>
          <p className="mt-4 text-lg text-gray-600 text-center">
            Get started for free. Upgrade for more resumes and cover letters.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free",
                price: "$0",
                features: [
                  "2 Resumes",
                  "1 Cover Letter",
                  "Basic Templates",
                  "AI Suggestions",
                ],
              },
              {
                title: "Pro",
                price: "$9.99/mo",
                features: [
                  "Unlimited Resumes",
                  "Unlimited Cover Letters",
                  "Premium Templates",
                  "Priority Support",
                ],
              },
              {
                title: "Enterprise",
                price: "Contact Us",
                features: [
                  "Unlimited Everything",
                  "Custom Branding",
                  "Team Collaboration",
                  "Dedicated Support",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h4 className="text-xl font-semibold">{plan.title}</h4>
                <p className="mt-2 text-3xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-600">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p>&copy; 2025 ResumeBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
