import { motion } from "framer-motion";
import { FaDownload, FaCheck, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function JobTemplate({ session }) {
  const downloadTemplate = (templateName) => {
    try {
      toast.info(`Preparing ${templateName} download...`, {
        autoClose: 2000,
      });

      // Using setTimeout to simulate download process
      setTimeout(() => {
        // Create a temporary download link
        const link = document.createElement("a");

        // Set file URLs
        const fileMap = {
          "Job Application Tracker": "/templates/job_application_tracker.xlsx",
          "Interview Prep Sheet": "/templates/interview_prep_sheet.pdf",
        };

        link.href = fileMap[templateName];
        link.download =
          templateName.replace(/\s+/g, "_") +
          (templateName.includes("Tracker") ? ".xlsx" : ".pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success toast
        toast.success(
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            <span>{templateName} downloaded successfully!</span>
          </div>,
          {
            autoClose: 3000,
          }
        );
      }, 1500);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <FaTimes className="text-red-500 mr-2" />
          <span>
            Failed to download {templateName}: {error.message}
          </span>
        </div>,
        {
          autoClose: 4000,
        }
      );
      console.error(`Error downloading ${templateName}:`, error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4"
    >
      <ToastContainer position="top-right" />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-4 md:mt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-4 md:mb-6">
          Job Search Templates
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
          Download our free templates to organize your job search and track
          applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Template 1 */}
          <div className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition">
            <div className="flex items-center mb-3 md:mb-4">
              <div className="bg-indigo-100 p-2 md:p-3 rounded-full mr-3">
                <FaDownload className="text-indigo-600 text-lg md:text-xl" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold">
                Job Application Tracker
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Excel template to track companies, positions, application dates,
              and follow-ups.
            </p>
            <button
              onClick={() => downloadTemplate("Job Application Tracker")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Download (.xlsx)
            </button>
          </div>

          {/* Template 2 */}
          <div className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition">
            <div className="flex items-center mb-3 md:mb-4">
              <div className="bg-purple-100 p-2 md:p-3 rounded-full mr-3">
                <FaDownload className="text-purple-600 text-lg md:text-xl" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold">
                Interview Prep Sheet
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Comprehensive checklist to prepare for interviews and track
              questions.
            </p>
            <button
              onClick={() => downloadTemplate("Interview Prep Sheet")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Download (.pdf)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobTemplate;
