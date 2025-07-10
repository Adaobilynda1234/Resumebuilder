import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaEnvelope,
  FaStar,
  FaDownload,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { useState } from "react";

function Home({ session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Hero Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
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
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
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
          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-indigo-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white px-4 pt-2 pb-4"
          >
            {session ? (
              <Link
                to="/dashboard"
                className="block text-indigo-600 hover:text-indigo-800 font-medium py-2"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block text-indigo-600 hover:text-indigo-800 font-medium py-2"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="block bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 mt-2"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Create Standout Resumes & Cover Letters
        </h2>
        <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          Build professional, ATS-optimized documents with AI-powered tools
          tailored for the Nigerian job market. Get hired faster with
          ResumeCraft.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to={session ? "/resume" : "/auth"}
            className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
          >
            <FaFileAlt className="mr-3" /> Build Resume
          </Link>
          <Link
            to={session ? "/cover-letter" : "/auth"}
            className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-full text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 transition transform hover:scale-105"
          >
            <FaEnvelope className="mr-3" /> Build Cover Letter
          </Link>
          <Link
            to="/job-template"
            className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-full text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition transform hover:scale-105"
          >
            <FaDownload className="mr-3" /> Job Templates
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
              icon: FaDownload,
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

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <h3 className="text-4xl font-bold text-gray-900 text-center">
          What Our Users Say
        </h3>
        <p className="mt-4 text-lg text-gray-700 text-center max-w-3xl mx-auto">
          Hear from professionals who transformed their job search with
          ResumeCraft.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Chinedu Okeke",
              role: "Software Engineer",
              quote:
                "ResumeCraft helped me land my dream job at a tech startup in Lagos. The AI suggestions were spot-on!",
              rating: 5,
            },
            {
              name: "Aisha Bello",
              role: "Marketing Manager",
              quote:
                "The templates are professional and easy to customize. I got interview calls within days!",
              rating: 4,
            },
            {
              name: "Tunde Adeyemi",
              role: "Financial Analyst",
              quote:
                "The cover letter builder saved me hours, and the ATS optimization really made a difference.",
              rating: 5,
            },
          ].map((testimonial, index) => (
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
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold text-gray-900">
                {testimonial.name}
              </p>
              <p className="text-gray-500">{testimonial.role}</p>
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
                  className="mt

-8 w-full inline-flex justify-center px-6 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
                >
                  Choose {plan.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white">ResumeCraft</h3>
              <p className="mt-4 text-gray-300">
                Empowering Nigerian professionals with AI-driven tools to create
                standout resumes and cover letters.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@resumecraft.com"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">
                Connect With Us
              </h4>
              <div className="mt-4 flex space-x-4">
                <a
                  href="https://twitter.com"
                  className="text-gray-300 hover:text-white transition"
                >
                  <FaTwitter className="text-2xl" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-gray-300 hover:text-white transition"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
                <a
                  href="https://github.com"
                  className="text-gray-300 hover:text-white transition"
                >
                  <FaGithub className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-indigo-600 pt-6">
            <p className="text-center text-gray-300">
              © 2025 ResumeCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
