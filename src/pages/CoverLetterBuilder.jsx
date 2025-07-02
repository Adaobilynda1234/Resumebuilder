import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function CoverLetterBuilder({ session }) {
  const [coverLetter, setCoverLetter] = useState({
    recipient: "",
    company: "",
    content: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [coverLetterCount, setCoverLetterCount] = useState(0);

  useEffect(() => {
    if (session) fetchCoverLetterCount();
  }, [session]);

  const fetchCoverLetterCount = async () => {
    const { data } = await supabase
      .from("cover_letters")
      .select("id")
      .eq("user_id", session.user.id);
    setCoverLetterCount(data.length);
  };

  const handleAIEnhance = async () => {
    if (!aiPrompt) return;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: `Write a professional cover letter for ${coverLetter.company}: ${aiPrompt}`,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );
      setCoverLetter({
        ...coverLetter,
        content: response.data.choices[0].text,
      });
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const saveCoverLetter = async () => {
    if (coverLetterCount >= 1) {
      alert("Upgrade to Pro for more cover letters!");
      return;
    }
    await supabase.from("cover_letters").insert({
      user_id: session.user.id,
      content: coverLetter,
    });
    fetchCoverLetterCount();
  };

  const exportPDF = async () => {
    const element = document.getElementById("cover-letter-preview");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("cover-letter.pdf");
  };

  if (!session) return <div>Please log in to build a cover letter.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-4"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Build Your Cover Letter</h2>
          <input
            type="text"
            placeholder="Recipient Name"
            value={coverLetter.recipient}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, recipient: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={coverLetter.company}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, company: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Cover Letter Content"
            value={coverLetter.content}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, content: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded h-40"
          />
          <input
            type="text"
            placeholder="AI Prompt for Cover Letter"
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleAIEnhance}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Enhance with AI
          </button>
          <button
            onClick={saveCoverLetter}
            className="mt-4 ml-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Cover Letter
          </button>
          <button
            onClick={exportPDF}
            className="mt-4 ml-2 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Export as PDF
          </button>
        </div>
        <div id="cover-letter-preview" className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold">{coverLetter.recipient}</h2>
          <p>{coverLetter.company}</p>
          <p className="mt-4">{coverLetter.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default CoverLetterBuilder;
