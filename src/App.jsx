import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Home from "./pages/Home";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetterBuilder from "./pages/CoverLetterBuilder";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home session={session} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/resume" element={<ResumeBuilder session={session} />} />
      <Route
        path="/cover-letter"
        element={<CoverLetterBuilder session={session} />}
      />
      <Route path="/dashboard" element={<Dashboard session={session} />} />
    </Routes>
  );
}

export default App;
