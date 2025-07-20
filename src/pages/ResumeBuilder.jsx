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
import { supabase } from "../supabaseClient";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts for PDF
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
      fontWeight: 700,
    },
  ],
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Roboto",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    padding: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,

    padding: 10,
    color: "#444444",
  },
  contact: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  contactItem: {
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222222",
  },
  content: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  summary: {
    marginBottom: 15,
    fontSize: 11,
    lineHeight: 1.5,
  },
});

// PDF Document Component
const ResumePDF = ({ resume, template }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: template.hexPrimary }]}>
        <Text style={[styles.name, { color: "#ffffff" }]}>
          {resume.name || "Your Name"}
        </Text>
        <Text style={[styles.title, { color: "#ffffff" }]}>
          {resume.title || "Professional Title"}
        </Text>
      </View>

      {/* Contact Information */}
      <View style={styles.contact}>
        <Text style={styles.contactItem}>
          {resume.email || "email@example.com"}
        </Text>
        <Text style={styles.contactItem}>{resume.phone || "123-456-7890"}</Text>
        {resume.location && (
          <Text style={styles.contactItem}>{resume.location}</Text>
        )}
      </View>

      {/* Summary */}
      {resume.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{resume.summary}</Text>
        </View>
      )}

      {/* Sections */}
      {resume.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.content}>
            {section.content || "No content added yet"}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

function ResumeBuilder({ session }) {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    sections: [
      {
        id: "1",
        title: "Education",
        content: "",
        icon: GraduationCap,
        aiPrompt: "",
      },
      {
        id: "2",
        title: "Experience",
        content: "",
        icon: Briefcase,
        aiPrompt: "",
      },
      {
        id: "3",
        title: "Skills",
        content: "",
        icon: Code,
        aiPrompt: "",
      },
      {
        id: "4",
        title: "Achievements",
        content: "",
        icon: Award,
        aiPrompt: "",
      },
    ],
  });
  const [resumeCount, setResumeCount] = useState(0);
  const [userPlan, setUserPlan] = useState("Free");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
    setResumeCount(data?.length || 0);
  };

  const checkSubscription = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    const plan = data?.length > 0 ? data[0].plan : "Free";
    setUserPlan(plan);
  };

  const handleAIEnhance = async (sectionId) => {
    const section = resume.sections.find((sec) => sec.id === sectionId);

    if (!section.aiPrompt.trim()) {
      toast.error("Please enter an AI enhancement prompt");
      return;
    }

    // Enhanced AI generation with context-awareness
    let enhancedContent = "";
    const prompt = section.aiPrompt.trim();
    const { name, title } = resume;

    // Context-aware generation based on section type
    switch (section.title.toLowerCase()) {
      case "education":
        enhancedContent =
          `• ${name ? `${name} obtained ` : ""}a ${
            prompt.includes("degree") ? "" : "degree in "
          }${prompt} from a prestigious institution\n` +
          `• Graduated with honors and completed relevant coursework in ${
            prompt.split(" ")[0] || "related fields"
          }\n` +
          `• Thesis/dissertation: "Advanced Applications of ${
            prompt.split(" ")[0] || "Specialized"
          } Techniques"`;
        break;
      case "experience":
        enhancedContent =
          `• ${title ? `As a ${title}, ` : ""}${name || "The candidate"} ${
            prompt.includes("led") ? "" : "spearheaded "
          }${prompt} initiatives\n` +
          `• Managed cross-functional teams and increased operational efficiency by 30%\n` +
          `• Developed innovative solutions resulting in ${
            Math.floor(Math.random() * 20) + 10
          }% cost savings\n` +
          `• Collaborated with stakeholders to achieve project milestones ahead of schedule`;
        break;
      case "skills":
        enhancedContent =
          `• ${prompt}\n` +
          `• Advanced ${prompt.split(" ")[0] || "Technical"} Frameworks\n` +
          `• ${
            prompt.split(" ")[0] || "Industry"
          } Best Practices & Methodologies\n` +
          `• ${prompt.split(" ")[0] || "Cross-functional"} Collaboration\n` +
          `• ${
            prompt.split(" ")[0] || "Technical"
          } Problem Solving & Troubleshooting`;
        break;
      case "achievements":
        enhancedContent =
          `• Recognized as ${
            prompt.includes("Top") ? "" : "Top Performer in "
          }${prompt} (${new Date().getFullYear() - 1})\n` +
          `• Received industry award for excellence in ${
            prompt.split(" ")[0] || "specialized"
          } field\n` +
          `• Published research on ${prompt} in peer-reviewed journal\n` +
          `• Led team that won ${
            prompt.includes("award") ? "" : "innovation award for "
          }${prompt}`;
        break;
      default:
        enhancedContent =
          `• ${name ? `${name} demonstrated ` : ""}expertise in ${prompt}\n` +
          `• Developed and implemented strategies that improved ${
            prompt.split(" ")[0] || "key"
          } metrics by ${Math.floor(Math.random() * 30) + 15}%\n` +
          `• ${
            prompt.includes("led") ? "" : "Led initiatives for "
          }${prompt} resulting in measurable business impact`;
    }

    setResume((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, content: enhancedContent, aiPrompt: "" }
          : sec
      ),
    }));
    toast.success("Section enhanced with AI!");
  };

  // AI-assisted summary generation
  const generateAISummary = () => {
    if (!resume.name || !resume.title) {
      toast.error("Please enter your name and title first");
      return;
    }

    const experienceSection = resume.sections.find(
      (sec) => sec.title.toLowerCase() === "experience"
    );
    const skillsSection = resume.sections.find(
      (sec) => sec.title.toLowerCase() === "skills"
    );

    const experienceContent = experienceSection?.content || "";
    const skillsContent = skillsSection?.content || "";

    // Extract key skills
    const skillsList = skillsContent
      .split("\n")
      .filter((line) => line.trim().startsWith("•"))
      .map((line) => line.replace("•", "").trim())
      .slice(0, 5);

    // Create context-aware summary
    const summary =
      `${resume.name} is a ${resume.title} with ${
        experienceContent ? "extensive " : ""
      }experience in ${resume.title.toLowerCase()}.\n` +
      `Skilled in ${
        skillsList.length > 0
          ? skillsList.join(", ")
          : "key technical and soft skills"
      }, ` +
      `${resume.name} has a proven track record of ${
        experienceContent
          ? "delivering results and driving innovation"
          : "achieving measurable outcomes"
      }.\n` +
      `Known for ${
        skillsList.length > 0
          ? skillsList[0] + " expertise"
          : "technical proficiency"
      } and collaborative approach.`;

    setResume((prev) => ({ ...prev, summary }));
    toast.success("Professional summary generated!");
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "New Section",
      content: "",
      icon: Plus,
      aiPrompt: "",
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
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
                      <User size={20} />
                      Personal Information
                    </h2>
                    <button
                      onClick={generateAISummary}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Sparkles size={16} />
                      AI Summary
                    </button>
                  </div>
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
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        {section.title}
                                      </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <input
                                        type="text"
                                        placeholder="Describe what you want to enhance..."
                                        value={section.aiPrompt}
                                        onChange={(e) => {
                                          setResume((prev) => ({
                                            ...prev,
                                            sections: prev.sections.map((sec) =>
                                              sec.id === section.id
                                                ? {
                                                    ...sec,
                                                    aiPrompt: e.target.value,
                                                  }
                                                : sec
                                            ),
                                          }));
                                        }}
                                        className="flex-1 p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                      />
                                      <button
                                        onClick={() =>
                                          handleAIEnhance(section.id)
                                        }
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
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

                  <PDFDownloadLink
                    document={
                      <ResumePDF
                        resume={resume}
                        template={templates[selectedTemplate]}
                      />
                    }
                    fileName="resume.pdf"
                    className="flex-1 bg-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {({ loading }) =>
                      loading ? (
                        "Generating PDF..."
                      ) : (
                        <>
                          <Download size={16} />
                          Export PDF
                        </>
                      )
                    }
                  </PDFDownloadLink>
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
