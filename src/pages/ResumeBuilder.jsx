import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Download,
  Save,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Palette,
} from "lucide-react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "../supabaseClient";

function ResumeBuilder({ session }) {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    sections: [
      { id: "1", title: "Education", content: "", icon: GraduationCap },
      { id: "2", title: "Experience", content: "", icon: Briefcase },
      { id: "3", title: "Skills", content: "", icon: Code },
      { id: "4", title: "Achievements", content: "", icon: Award },
    ],
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [resumeCount, setResumeCount] = useState(0);
  const [userPlan, setUserPlan] = useState("Free");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const templates = {
    modern: {
      name: "Modern",
      primaryColor: "bg-blue-600",
      accentColor: "bg-blue-100",
      textColor: "text-gray-800",
      hexPrimary: "#2563eb",
      hexAccent: "#dbeafe",
    },
    elegant: {
      name: "Elegant",
      primaryColor: "bg-purple-600",
      accentColor: "bg-purple-100",
      textColor: "text-gray-800",
      hexPrimary: "#7c3aed",
      hexAccent: "#ede9fe",
    },
    professional: {
      name: "Professional",
      primaryColor: "bg-gray-800",
      accentColor: "bg-gray-100",
      textColor: "text-gray-800",
      hexPrimary: "#1f2937",
      hexAccent: "#f3f4f6",
    },
    creative: {
      name: "Creative",
      primaryColor: "bg-pink-500",
      accentColor: "bg-orange-100",
      textColor: "text-gray-800",
      hexPrimary: "#ec4899",
      hexAccent: "#ffedd5",
    },
  };

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
    if (!aiPrompt) {
      toast.error("Please enter an AI enhancement prompt");
      return;
    }

    // Mock AI enhancement (replace with actual API call in production)
    const enhancedContent = `Enhanced content for ${aiPrompt}:\n\n• Leveraged advanced ${aiPrompt} techniques to improve performance by 40%\n• Collaborated with cross-functional teams to deliver innovative solutions\n• Demonstrated expertise in ${aiPrompt} through successful project delivery\n• Maintained high standards of quality and attention to detail`;

    setResume((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, content: enhancedContent } : sec
      ),
    }));
    setAiPrompt("");
    toast.success("Section enhanced successfully!");
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "New Section",
      content: "",
      icon: Plus,
    };
    setResume((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    toast.success("New section added!");
  };

  const deleteSection = (sectionId) => {
    setResume((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== sectionId),
    }));
    toast.success("Section deleted successfully!");
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    setResume((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, title: newTitle } : sec
      ),
    }));
  };

  const saveResume = async () => {
    if (userPlan === "Free" && resumeCount >= 2) {
      toast.error("Upgrade to Pro or Enterprise for more resumes!");
      window.location.href = "/checkout/pro";
      return;
    }
    await supabase.from("resumes").insert({
      user_id: session.user.id,
      content: resume,
    });
    toast.success("Resume saved successfully!");
    fetchResumeCount();
  };

  const exportPDF = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) {
      toast.error("Error generating PDF");
      return;
    }

    try {
      // Clone the preview element to avoid modifying the original DOM
      const tempContainer = element.cloneNode(true);
      // Set explicit dimensions to match A4 size (210mm x 297mm at 96 DPI)
      tempContainer.style.width = "794px";
      tempContainer.style.height = "1123px";
      tempContainer.style.transform = "none"; // Remove scale-90
      tempContainer.style.overflow = "hidden";
      tempContainer.style.fontFamily = "Arial, sans-serif"; // Fallback font

      // Append a custom stylesheet to map Tailwind classes to HEX colors
      const style = document.createElement("style");
      style.textContent = `
        .bg-blue-600 { background-color: #2563eb !important; }
        .bg-blue-100 { background-color: #dbeafe !important; }
        .bg-purple-600 { background-color: #7c3aed !important; }
        .bg-purple-100 { background-color: #ede9fe !important; }
        .bg-gray-800 { background-color: #1f2937 !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-pink-500 { background-color: #ec4899 !important; }
        .bg-orange-100 { background-color: #ffedd5 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-white { color: #ffffff !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
        .bg-gradient-to-r, .bg-gradient-to-br { background: none !important; }
        .bg-white { background-color: #ffffff !important; }
        .border-none { border: none !important; }
        .rounded-lg { border-radius: 8px !important; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
        .p-4 { padding: 16px !important; }
        .p-6 { padding: 24px !important; }
        .p-8 { padding: 32px !important; }
        .mb-2 { margin-bottom: 8px !important; }
        .mb-3 { margin-bottom: 12px !important; }
        .mb-4 { margin-bottom: 16px !important; }
        .mb-6 { margin-bottom: 24px !important; }
        .mb-8 { margin-bottom: 32px !important; }
        .text-xl { font-size: 20px !important; }
        .text-2xl { font-size: 24px !important; }
        .text-3xl { font-size: 30px !important; }
        .text-4xl { font-size: 36px !important; }
        .text-base { font-size: 16px !important; }
        .text-sm { font-size: 14px !important; }
        .text-xs { font-size: 12px !important; }
        .font-bold { font-weight: 700 !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-light { font-weight: 300 !important; }
        .flex { display: flex !important; }
        .flex-wrap { flex-wrap: wrap !important; }
        .gap-1 { gap: 4px !important; }
        .gap-2 { gap: 8px !important; }
        .gap-3 { gap: 12px !important; }
        .gap-4 { gap: 16px !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .text-center { text-align: center !important; }
        .italic { font-style: italic !important; }
        .leading-relaxed { line-height: 1.625 !important; }
        .whitespace-pre-line { white-space: pre-line !important; }
        * { font-family: Arial, sans-serif !important; }
      `;
      tempContainer.appendChild(style);

      // Replace Tailwind classes with inline styles for compatibility
      const elementsWithClasses = tempContainer.querySelectorAll("[class]");
      elementsWithClasses.forEach((el) => {
        if (
          el.nodeType !== Node.ELEMENT_NODE ||
          !el.className ||
          typeof el.className !== "string"
        ) {
          return;
        }
        const classes = el.className.split(" ");
        classes.forEach((cls) => {
          if (cls.startsWith("bg-") && templates[selectedTemplate][cls]) {
            el.style.backgroundColor =
              templates[selectedTemplate][cls.replace("bg-", "hex")];
          }
          if (cls.startsWith("text-")) {
            el.style.color = cls.includes("white") ? "#ffffff" : "#1f2937";
          }
          if (cls.startsWith("border-")) {
            el.style.borderColor = "#e5e7eb";
            el.style.borderWidth = "1px";
            el.style.borderStyle = "solid";
          }
          if (cls.includes("rounded-lg")) {
            el.style.borderRadius = "8px";
          }
          if (cls.includes("shadow-lg")) {
            el.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }
        });
      });

      // Handle Lucide icons by converting SVGs to images
      const svgs = tempContainer.querySelectorAll("svg");
      svgs.forEach((svg) => {
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = document.createElement("img");
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
        img.style.width = svg.getAttribute("width") || "18px";
        img.style.height = svg.getAttribute("height") || "18px";
        svg.parentNode.replaceChild(img, svg);
      });

      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
      toast.success("Resume exported as PDF!");

      document.body.removeChild(tempContainer);
    } catch (error) {
      toast.error("Error exporting PDF");
      console.error(error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSections = Array.from(resume.sections);
    const [moved] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, moved);
    setResume({ ...resume, sections: reorderedSections });
  };

  const ModernTemplate = ({ resume, template }) => (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${template.textColor} max-w-4xl mx-auto box-border`}
    >
      <div
        className={`${template.primaryColor} text-white p-4 sm:p-6 md:p-8`}
        style={{ backgroundColor: template.hexPrimary }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          {resume.name || "Your Name"}
        </h1>
        <p className="text-sm sm:text-base md:text-lg opacity-90 mb-3">
          {resume.title || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Mail size={14} />
            <span>{resume.email || "email@example.com"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={14} />
            <span>{resume.phone || "123-456-7890"}</span>
          </div>
          {resume.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{resume.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {resume.summary && (
          <div className="mb-6">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 border-b-2 border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
              {resume.summary}
            </p>
          </div>
        )}

        {resume.sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 border-b-2 border-gray-200 pb-1 flex items-center gap-2">
              {section.icon && <section.icon size={18} />}
              {section.title}
            </h2>
            <div className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
              {section.content || "No content added yet"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ElegantTemplate = ({ resume, template }) => (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${template.textColor} max-w-4xl mx-auto box-border`}
    >
      <div className="p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-light mb-2">
            {resume.name || "Your Name"}
          </h1>
          <div
            className={`h-1 w-20 ${template.primaryColor} mx-auto mb-3`}
            style={{ backgroundColor: template.hexPrimary }}
          ></div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4">
            {resume.title || "Professional Title"}
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{resume.email || "email@example.com"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{resume.phone || "123-456-7890"}</span>
            </div>
            {resume.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{resume.location}</span>
              </div>
            )}
          </div>
        </div>

        {resume.summary && (
          <div className="mb-8">
            <h2 className="text-base sm:text-xl md:text-2xl font-light mb-4 text-center">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed text-center italic">
              {resume.summary}
            </p>
          </div>
        )}

        {resume.sections.map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-base sm:text-xl md:text-2xl font-light mb-4 text-center flex items-center justify-center gap-2">
              {section.icon && <section.icon size={20} />}
              {section.title}
            </h2>
            <div className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
              {section.content || "No content added yet"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!session) {
    return (
      <div className="text-center py-8">Please log in to build a resume.</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Resume Builder
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create a professional resume that stands out
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !isPreviewMode
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            } text-sm sm:text-base`}
          >
            <Plus className="inline mr-2" size={16} />
            Edit
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isPreviewMode
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            } text-sm sm:text-base`}
          >
            <Eye className="inline mr-2" size={16} />
            Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="wait">
            {!isPreviewMode ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                    <Palette size={20} />
                    Choose Template
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(templates).map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTemplate(key)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTemplate === key
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`h-12 ${template.primaryColor} rounded mb-2`}
                          style={{ backgroundColor: template.hexPrimary }}
                        ></div>
                        <p className="text-xs sm:text-sm font-medium">
                          {template.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                    <User size={20} />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={resume.name}
                      onChange={(e) =>
                        setResume({ ...resume, name: e.target.value })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Professional Title"
                      value={resume.title}
                      onChange={(e) =>
                        setResume({ ...resume, title: e.target.value })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={resume.email}
                      onChange={(e) =>
                        setResume({ ...resume, email: e.target.value })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={resume.phone}
                      onChange={(e) =>
                        setResume({ ...resume, phone: e.target.value })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={resume.location}
                      onChange={(e) =>
                        setResume({ ...resume, location: e.target.value })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:col-span-2 text-sm sm:text-base"
                    />
                  </div>
                  <div className="mt-4">
                    <textarea
                      placeholder="Professional Summary (Optional)"
                      value={resume.summary}
                      onChange={(e) =>
                        setResume({ ...resume, summary: e.target.value })
                      }
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                      <Briefcase size={20} />
                      Resume Sections
                    </h2>
                    <button
                      onClick={addSection}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Plus size={16} />
                      Add Section
                    </button>
                  </div>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
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
                                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 box-border"
                                >
                                  <div className="flex items-center gap-2 mb-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move"
                                    >
                                      <GripVertical
                                        size={16}
                                        className="text-gray-400"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={section.title}
                                      onChange={(e) =>
                                        updateSectionTitle(
                                          section.id,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-sm sm:text-base"
                                    />
                                    <button
                                      onClick={() => deleteSection(section.id)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  <textarea
                                    value={section.content}
                                    onChange={(e) =>
                                      setResume({
                                        ...resume,
                                        sections: resume.sections.map((sec) =>
                                          sec.id === section.id
                                            ? {
                                                ...sec,
                                                content: e.target.value,
                                              }
                                            : sec
                                        ),
                                      })
                                    }
                                    placeholder={`Enter your ${section.title.toLowerCase()} details...`}
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none text-sm sm:text-base"
                                  />
                                  <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-purple-200 box-border">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Sparkles
                                        size={16}
                                        className="text-purple-600"
                                      />
                                      <span className="text-sm font-medium text-purple-700">
                                        AI Enhancement
                                      </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <input
                                        type="text"
                                        placeholder="Describe what you want to enhance..."
                                        value={aiPrompt}
                                        onChange={(e) =>
                                          setAiPrompt(e.target.value)
                                        }
                                        className="flex-1 p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                      />
                                      <button
                                        onClick={() =>
                                          handleAIEnhance(section.id)
                                        }
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                        style={{ backgroundColor: "#7c3aed" }}
                                      >
                                        Enhance
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={saveResume}
                    className="flex-1 bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save size={16} />
                    Save Resume
                  </button>
                  <button
                    onClick={exportPDF}
                    className="flex-1 bg-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Download size={16} />
                    Export PDF
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${isPreviewMode ? "lg:col-span-2" : ""}`}
          >
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  Preview
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Template: {templates[selectedTemplate].name}
                </p>
              </div>

              <div
                id="resume-preview"
                className="transform scale-90 origin-top-left max-w-full overflow-x-auto"
              >
                {selectedTemplate === "elegant" ? (
                  <ElegantTemplate
                    resume={resume}
                    template={templates[selectedTemplate]}
                  />
                ) : (
                  <ModernTemplate
                    resume={resume}
                    template={templates[selectedTemplate]}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ResumeBuilder;
