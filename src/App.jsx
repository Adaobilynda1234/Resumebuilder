import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Home from "./pages/Home";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetterBuilder from "./pages/CoverLetterBuilder";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobTemplate from "./pages/JobTemplate";

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [navigate]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/resume" element={<ResumeBuilder session={session} />} />
        <Route
          path="/job-template"
          element={<JobTemplate session={session} />}
        />
        <Route
          path="/cover-letter"
          element={<CoverLetterBuilder session={session} />}
        />
        <Route path="/dashboard" element={<Dashboard session={session} />} />
        <Route
          path="/checkout/:plan"
          element={<Checkout session={session} />}
        />
      </Routes>
    </>
  );
}

export default App;
