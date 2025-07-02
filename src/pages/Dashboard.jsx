import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Dashboard({ session }) {
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      fetchResumes();
      fetchCoverLetters();
    }
  }, [session]);

  const fetchResumes = async () => {
    const { data } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", session.user.id);
    setResumes(data);
  };

  const fetchCoverLetters = async () => {
    const { data } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("user_id", session.user.id);
    setCoverLetters(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!session) return <div>Please log in.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Resumes</h3>
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white p-4 mb-2 rounded shadow">
                <h4 className="font-semibold">{resume.content.name}</h4>
                <Link to="/resume" className="text-blue-600">
                  Edit
                </Link>
              </div>
            ))}
            <Link
              to="/resume"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create New Resume
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Cover Letters</h3>
            {coverLetters.map((letter) => (
              <div key={letter.id} className="bg-white p-4 mb-2 rounded shadow">
                <h4 className="font-semibold">{letter.content.recipient}</h4>
                <Link to="/cover-letter" className="text-blue-600">
                  Edit
                </Link>
              </div>
            ))}
            <Link
              to="/cover-letter"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create New Cover Letter
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
