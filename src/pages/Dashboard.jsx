import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaEnvelope,
  FaDownload,
  FaPlus,
  FaSignOutAlt,
  FaTrash,
  FaHome,
} from "react-icons/fa";

function Dashboard({ session }) {
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      fetchResumes();
      fetchCoverLetters();
    }
  }, [session]);

  const fetchResumes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", session.user.id);

    if (!error) setResumes(data || []);
    setLoading(false);
  };

  const fetchCoverLetters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("user_id", session.user.id);

    if (!error) setCoverLetters(data || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const goToHome = () => {
    navigate("/");
  };

  // Fixed delete functions with immediate UI update
  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    // Optimistically update UI
    setResumes((prev) => prev.filter((resume) => resume.id !== id));

    const { error } = await supabase.from("resumes").delete().eq("id", id);

    if (error) {
      alert("Failed to delete resume. Please try again.");
      // Revert UI if delete fails
      fetchResumes();
    }
  };

  const deleteCoverLetter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cover letter?"))
      return;

    // Optimistically update UI
    setCoverLetters((prev) => prev.filter((letter) => letter.id !== id));

    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete cover letter. Please try again.");
      // Revert UI if delete fails
      fetchCoverLetters();
    }
  };

  if (!session) return <div>Please log in.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, {session.user.email.split("@")[0]}!
            </h2>
            <p className="text-gray-600">
              Manage your resumes and cover letters
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={goToHome}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
            >
              <FaHome /> Home
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/resume"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col items-center justify-center"
          >
            <FaFileAlt className="text-3xl mb-3" />
            <h3 className="text-xl font-semibold">Create Resume</h3>
            <p className="text-indigo-100 mt-2 text-center">
              Build a new professional resume
            </p>
          </Link>

          <Link
            to="/cover-letter"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col items-center justify-center"
          >
            <FaEnvelope className="text-3xl mb-3" />
            <h3 className="text-xl font-semibold">Create Cover Letter</h3>
            <p className="text-purple-100 mt-2 text-center">
              Craft a personalized cover letter
            </p>
          </Link>

          <Link
            to="/job-template"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col items-center justify-center"
          >
            <FaDownload className="text-3xl mb-3" />
            <h3 className="text-xl font-semibold">Job Templates</h3>
            <p className="text-teal-100 mt-2 text-center">
              Download job search resources
            </p>
          </Link>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Your Documents</h3>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resumes */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold flex items-center">
                    <FaFileAlt className="text-indigo-600 mr-2" /> Resumes
                  </h4>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                    {resumes.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {resumes.slice(0, 3).map((resume) => (
                    <div
                      key={resume.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div>
                        <h5 className="font-medium">
                          {resume.content.name || "Untitled Resume"}
                        </h5>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/resume/${resume.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded hover:bg-indigo-50 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteResume(resume.id)}
                          className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  {resumes.length === 0 && (
                    <p className="text-gray-500 italic">
                      No resumes created yet
                    </p>
                  )}

                  <Link
                    to="/resume"
                    className="inline-flex items-center text-indigo-600 font-medium mt-2"
                  >
                    <FaPlus className="mr-2" /> Create new resume
                  </Link>
                </div>
              </div>

              {/* Cover Letters */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold flex items-center">
                    <FaEnvelope className="text-purple-600 mr-2" /> Cover
                    Letters
                  </h4>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    {coverLetters.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {coverLetters.slice(0, 3).map((letter) => (
                    <div
                      key={letter.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div>
                        <h5 className="font-medium">
                          {letter.content.recipient || "Untitled Cover Letter"}
                        </h5>
                        <p className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(letter.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/cover-letter/${letter.id}`}
                          className="text-purple-600 hover:text-purple-800 font-medium px-3 py-1 rounded hover:bg-purple-50 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteCoverLetter(letter.id)}
                          className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  {coverLetters.length === 0 && (
                    <p className="text-gray-500 italic">
                      No cover letters created yet
                    </p>
                  )}

                  <Link
                    to="/cover-letter"
                    className="inline-flex items-center text-purple-600 font-medium mt-2"
                  >
                    <FaPlus className="mr-2" /> Create new cover letter
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
