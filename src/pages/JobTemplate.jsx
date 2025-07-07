import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

function JobTemplate({ session }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Job Search Templates
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Download our free templates to organize your job search and track
          applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template 1 */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FaDownload className="text-indigo-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Job Application Tracker</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Excel template to track companies, positions, application dates,
              and follow-ups.
            </p>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition">
              Download (.xlsx)
            </button>
          </div>

          {/* Template 2 */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaDownload className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Interview Prep Sheet</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive checklist to prepare for interviews and track
              questions.
            </p>
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition">
              Download (.pdf)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobTemplate;
