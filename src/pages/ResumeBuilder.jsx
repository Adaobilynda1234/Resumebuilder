import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function ResumeBuilder({ session }) {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    sections: [
      { id: "1", title: "Education", content: "" },
      { id: "2", title: "Experience", content: "" },
      { id: "3", title: "Skills", content: "" },
    ],
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [resumeCount, setResumeCount] = useState(0);
  const [userPlan, setUserPlan] = useState("Free");

  useEffect(() => {
    if (session) {
      fetchResumeCount();
      checkSubscription();
    }
  }, [session]);

  const fetchResumeCount = async () => {
    const { data } = await supabase
      .from("resumes")
      .select("id")
      .eq("user_id", session.user.id);
    setResumeCount(data.length);
  };

  const checkSubscription = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    const plan = data.length > 0 ? data[0].plan : "Free";
    setUserPlan(plan);
  };

  const handleAIEnhance = async (sectionId) => {
    if (!aiPrompt) return;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: `Enhance the following resume section: ${aiPrompt}`,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );
      setResume((prev) => ({
        ...prev,
        sections: prev.sections.map((sec) =>
          sec.id === sectionId
            ? { ...sec, content: response.data.choices[0].text }
            : sec
        ),
      }));
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const saveResume = async () => {
    if (userPlan === "Free" && resumeCount >= 2) {
      alert("Upgrade to Pro or Enterprise for more resumes!");
      window.location.href = "/checkout/pro";
      return;
    }
    await supabase.from("resumes").insert({
      user_id: session.user.id,
      content: resume,
    });
    fetchResumeCount();
  };

  const exportPDF = async () => {
    const element = document.getElementById("resume-preview");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSections = Array.from(resume.sections);
    const [moved] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, moved);
    setResume({ ...resume, sections: reorderedSections });
  };

  if (!session) return <div>Please log in to build a resume.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-4"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Build Your Resume</h2>
          <input
            type="text"
            placeholder="Name"
            value={resume.name}
            onChange={(e) => setResume({ ...resume, name: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={resume.email}
            onChange={(e) => setResume({ ...resume, email: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={resume.phone}
            onChange={(e) => setResume({ ...resume, phone: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {resume.sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 mb-2 rounded shadow"
                        >
                          <h3 className="font-semibold">{section.title}</h3>
                          <textarea
                            value={section.content}
                            onChange={(e) =>
                              setResume({
                                ...resume,
                                sections: resume.sections.map((sec) =>
                                  sec.id === section.id
                                    ? { ...sec, content: e.target.value }
                                    : sec
                                ),
                              })
                            }
                            className="w-full p-2 border rounded"
                          />
                          <input
                            type="text"
                            placeholder="AI Prompt"
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full p-2 mb-2 border rounded"
                          />
                          <button
                            onClick={() => handleAIEnhance(section.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                          >
                            Enhance with AI
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            onClick={saveResume}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Resume
          </button>
          <button
            onClick={exportPDF}
            className="mt-4 ml-2 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Export as PDF
          </button>
        </div>
        <div id="resume-preview" className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold">{resume.name}</h2>
          <p>
            {resume.email} | {resume.phone}
          </p>
          {resume.sections.map((section) => (
            <div key={section.id} className="mt-4">
              <h3 className="font-semibold">{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ResumeBuilder;
