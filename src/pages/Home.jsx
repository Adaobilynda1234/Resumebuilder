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
  FaCheckCircle,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaQuoteLeft,
  FaArrowRight,
  FaPlay,
  FaHeart,
  FaAward,
  FaLightbulb,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

function Home({ session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ResumeCraft
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Pricing
              </a>
            </nav>

            {session ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden relative z-50 p-2 rounded-lg bg-white/20 backdrop-blur-sm"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6 text-indigo-600" />
              ) : (
                <FaBars className="w-6 h-6 text-indigo-600" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-white/20"
        >
          <div className="px-4 py-6 space-y-4">
            <nav className="space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                Pricing
              </a>
            </nav>

            {session ? (
              <Link
                to="/dashboard"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/auth"
                  className="block w-full text-center border border-indigo-600 text-indigo-600 py-3 rounded-full hover:bg-indigo-50 transition-all"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-semibold text-sm mb-6">
            <FaRocket className="mr-2" />
            Trusted by 1m Professionals
          </span>
        </motion.div>

        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Create Standout Resume and Cover Letters
          <br />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
        >
          Build professional, ATS-optimized documents with AI-powered tools
          tailored for the Nigerian/foreign job market. Join thousands of
          professionals who landed their dream jobs with ResumeCraft.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Link
            to={session ? "/resume" : "/auth"}
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <FaFileAlt className="mr-3 group-hover:rotate-12 transition-transform" />
            Build Resume
            <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={session ? "/cover-letter" : "/auth"}
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaEnvelope className="mr-3 group-hover:rotate-12 transition-transform" />
            Build Cover Letter
          </Link>

          <Link
            to="/job-template"
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaDownload className="mr-3 group-hover:bounce transition-transform" />
            Job Templates
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: "10K+", label: "Resumes Created" },
            { number: "85%", label: "Success Rate" },
            { number: "500+", label: "Companies Hiring" },
            { number: "4.9/5", label: "User Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            Why Choose ResumeCraft?
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform empowers Nigerian professionals with cutting-edge tools
            to succeed in today's competitive job market.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Insights",
              desc: "Get personalized content suggestions and optimization tips powered by advanced AI technology.",
              icon: FaLightbulb,
              color: "from-yellow-400 to-orange-500",
            },
            {
              title: "Professional Templates",
              desc: "Choose from 50+ modern, ATS-friendly templates designed for Nigerian job market.",
              icon: FaFileAlt,
              color: "from-blue-400 to-indigo-500",
            },
            {
              title: "Job Search Templates",
              desc: "Downloadable templates and trackers to organize / accelerate your job search process.",
              icon: FaDownload,
              color: "from-green-400 to-teal-500",
            },
            {
              title: "ATS Optimization",
              desc: "Ensure your resume passes through Applicant Tracking Systems with our optimization tools.",
              icon: FaShieldAlt,
              color: "from-purple-400 to-pink-600",
            },
            {
              title: "Real-time Collaboration",
              desc: "Share and get feedback on your documents from mentors, colleagues,friends and career coaches.",
              icon: FaUsers,
              color: "from-cyan-400 to-blue-600",
            },
            {
              title: "Industry Expertise",
              desc: "Tailored advice and templates for specific Nigerian industries and job roles.",
              icon: FaAward,
              color: "from-red-400 to-pink-600",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-white/20 hover:border-indigo-200 hover:-translate-y-2"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="text-white text-2xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section
        id="testimonials"
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from professionals who transformed their careers with
              ResumeCraft
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Chinedu Okeke",
                role: "Software Engineer at TechCorp",
                location: "Lagos, Nigeria",
                quote:
                  "ResumeCraft helped me land my dream job at a top tech company in Lagos. The AI suggestions were incredibly accurate and helped me highlight my skills perfectly. I got 3 interview calls within a week!",
                rating: 5,
                avatar: "CO",
                company: "TechCorp",
              },
              {
                name: "Aisha Bello",
                role: "Marketing Manager at BrandFlow",
                location: "Abuja, Nigeria",
                quote:
                  "The templates are not just beautiful, they're strategic. I love how the platform guided me through each section. My new resume got me promoted within 2 months of using ResumeCraft!",
                rating: 5,
                avatar: "AB",
                company: "BrandFlow",
              },
              {
                name: "Tunde Adeyemi",
                role: "Financial Analyst at FinanceHub",
                location: "Port Harcourt, Nigeria",
                quote:
                  "The cover letter builder is a game-changer. It saved me hours of writing and the ATS optimization feature made sure my applications weren't getting filtered out. Highly recommended!",
                rating: 5,
                avatar: "TA",
                company: "FinanceHub",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-indigo-200 group hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-indigo-600 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                </div>

                <div className="relative">
                  <FaQuoteLeft className="absolute -top-2 -left-2 text-indigo-200 text-2xl" />
                  <p className="text-gray-600 italic leading-relaxed pl-6">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Verified {testimonial.company} Employee
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  4.9/5
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  3,500+
                </div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  85%
                </div>
                <div className="text-gray-600">Job Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  30+
                </div>
                <div className="text-gray-600">Industries Covered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start for free, upgrade when you're ready. All plans include
              secure payment with Paystack.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free",
                price: "₦0",
                period: "forever",
                description: "Perfect for getting started",
                features: [
                  "2 Professional Resumes",
                  "1 Cover Letter",
                  "Basic Templates",
                  "AI Suggestions",
                  "PDF Download",
                  "Basic Support",
                ],
                link: "/auth",
                popular: false,
                buttonText: "Get Started Free",
              },
              {
                title: "Pro",
                price: "₦4,000",
                period: "per month",
                description: "Best for active job seekers",
                features: [
                  "Unlimited Resumes",
                  "Unlimited Cover Letters",
                  "50+ Premium Templates",
                  "Advanced AI Insights",
                  "ATS Optimization",
                  "Priority Support",
                  "Collaboration Tools",
                  "Interview Prep Guide",
                ],
                link: "/checkout/pro",
                popular: true,
                buttonText: "Start Pro Trial",
              },
              {
                title: "Enterprise",
                price: "₦20,000",
                period: "per month",
                description: "For teams and organizations",
                features: [
                  "Everything in Pro",
                  "Team Management",
                  "Custom Branding",
                  "Bulk Operations",
                  "Analytics Dashboard",
                  "Dedicated Support",
                  "Training Sessions",
                  "API Access",
                ],
                link: "/checkout/enterprise",
                popular: false,
                buttonText: "Contact Sales",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className={`relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all border ${
                  plan.popular
                    ? "border-indigo-300 ring-2 ring-indigo-200 transform scale-105"
                    : "border-white/20 hover:border-indigo-200"
                } hover:-translate-y-2`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-indigo-600">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.link}
                  className={`block w-full text-center py-4 px-6 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      : "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full">
              <FaShieldAlt className="text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">
                30-Day Money-Back Guarantee
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h3>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
              Join thousands of Nigerian professionals who've successfully
              transformed their careers with ResumeCraft.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={session ? "/resume" : "/auth"}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-indigo-600 hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                <FaRocket className="mr-3" />
                Start Building Now
              </Link>
              <button className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105">
                <FaPlay className="mr-3" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  ResumeCraft
                </h3>
                <span className="ml-3 px-3 py-1 bg-indigo-600 text-white text-xs rounded-full">
                  Made in Nigeria
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Empowering Nigerian professionals with AI-driven tools to create
                standout resumes and cover letters. Your career success is our
                mission.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all transform hover:scale-110"
                >
                  <FaTwitter className="text-white text-lg" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all transform hover:scale-110"
                >
                  <FaLinkedin className="text-white text-lg" />
                </a>
                <a
                  href="https://github.com"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all transform hover:scale-110"
                >
                  <FaGithub className="text-white text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/resume"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cover-letter"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Cover Letter Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/job-template"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Job Templates
                  </Link>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@resumecraft.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-indigo-400 mr-3" />
                <span className="text-gray-300">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-indigo-400 mr-3" />
                <span className="text-gray-300">+234 807 123 4567</span>
              </div>
              <div className="flex items-center">
                <FaGlobe className="text-indigo-400 mr-3" />
                <span className="text-gray-300">Available 24/7</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ResumeCraft. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-3">Made with</span>
              <FaHeart className="text-red-500 mr-3" />
              <span className="text-gray-400 text-sm">
                for all professionals
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
