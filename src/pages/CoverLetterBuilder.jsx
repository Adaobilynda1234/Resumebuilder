import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import {
  Mail,
  User,
  Briefcase,
  Download,
  Save,
  Sparkles,
  Plus,
  MapPin,
  Phone,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

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
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzc.ttf",
      fontWeight: 300,
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
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    fontSize: 10,
  },
  dateInfo: {
    marginBottom: 20,
    fontSize: 10,
  },
  recipientInfo: {
    marginBottom: 20,
    fontSize: 11,
    lineHeight: 1.5,
  },
  greeting: {
    marginBottom: 10,
    fontSize: 11,
  },
  content: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 15,
  },
  closing: {
    marginTop: 20,
    fontSize: 11,
  },
  signature: {
    marginTop: 40,
    fontSize: 11,
  },
});

// PDF Document Component
const CoverLetterPDF = ({ coverLetter, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{user?.name || "Your Name"}</Text>

        <View style={styles.contactInfo}>
          <Text>{user?.email || "email@example.com"}</Text>
          <Text>{user?.phone || "(123) 456-7890"}</Text>
          <Text>{user?.location || "City, State"}</Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.dateInfo}>
        <Text>
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>

      {/* Recipient */}
      <View style={styles.recipientInfo}>
        <Text>{coverLetter.recipient || "Hiring Manager"}</Text>
        <Text>{coverLetter.company || "Company Name"}</Text>
        <Text>{coverLetter.companyAddress || "Company Address"}</Text>
      </View>

      {/* Greeting */}
      <View style={styles.greeting}>
        <Text>
          Dear{" "}
          {coverLetter.recipient
            ? coverLetter.recipient.split(" ")[0]
            : "Hiring Manager"}
          ,
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text>
          {coverLetter.content ||
            "Your cover letter content will appear here..."}
        </Text>
      </View>

      {/* Closing */}
      <View style={styles.closing}>
        <Text>Sincerely,</Text>
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <Text>{user?.name || "Your Name"}</Text>
      </View>
    </Page>
  </Document>
);

function CoverLetterBuilder({ session }) {
  const [coverLetter, setCoverLetter] = useState({
    recipient: "",
    company: "",
    companyAddress: "",
    content: "",
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterCount, setCoverLetterCount] = useState(0);
  const [userPlan, setUserPlan] = useState("Free");

  useEffect(() => {
    if (session) {
      fetchCoverLetterCount();
      checkSubscription();
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) {
      setUser({
        name: data.full_name || "",
        email: session.user.email,
        phone: data.phone || "",
        location: data.location || "",
        title: data.title || "",
      });
    }
  };

  const fetchCoverLetterCount = async () => {
    const { data } = await supabase
      .from("cover_letters")
      .select("id")
      .eq("user_id", session.user.id);
    setCoverLetterCount(data?.length || 0);
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

  const handleAIEnhance = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt for AI enhancement");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would call an actual AI API here
      // For this demo, we'll generate sample content
      const enhancedContent = `I am writing to express my interest in the position at ${
        coverLetter.company || "your company"
      }. With my extensive experience in ${aiPrompt}, I am confident in my ability to contribute effectively to your team.

In my previous role, I successfully ${
        aiPrompt.split(" ")[0] || "managed"
      } projects that resulted in significant improvements. My skills in ${aiPrompt} align perfectly with the requirements for this position, and I am excited about the opportunity to bring my expertise to your organization.

I am particularly drawn to ${
        coverLetter.company || "your company"
      } because of your commitment to innovation and excellence. I am eager to discuss how my background, skills, and enthusiasms can benefit your team.`;

      setCoverLetter((prev) => ({
        ...prev,
        content: enhancedContent,
      }));

      toast.success("Cover letter enhanced with AI!");
    } catch (error) {
      toast.error("Failed to enhance cover letter");
      console.error("AI Enhancement Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCoverLetter = async () => {
    if (userPlan === "Free" && coverLetterCount >= 3) {
      toast.error("Upgrade to Pro or Enterprise for more cover letters!");
      return;
    }

    try {
      await supabase.from("cover_letters").insert({
        user_id: session.user.id,
        content: coverLetter,
        user_info: user,
      });

      toast.success("Cover letter saved successfully!");
      fetchCoverLetterCount();
    } catch (error) {
      toast.error("Failed to save cover letter");
      console.error("Save Error:", error);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cover Letter Builder
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to build your cover letter
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => (window.location.href = "/login")}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Cover Letter Builder
          </h1>
          <p className="text-gray-600 text-lg">
            Create a professional cover letter in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase size={24} className="text-blue-600" />
              Build Your Cover Letter
            </h2>

            <div className="space-y-6">
              {/* User Information */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Your Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={user.title}
                      onChange={(e) =>
                        setUser({ ...user, title: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Job Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={user.location}
                      onChange={(e) =>
                        setUser({ ...user, location: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Briefcase size={20} />
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={coverLetter.recipient}
                      onChange={(e) =>
                        setCoverLetter({
                          ...coverLetter,
                          recipient: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hiring Manager Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={coverLetter.company}
                      onChange={(e) =>
                        setCoverLetter({
                          ...coverLetter,
                          company: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Address
                    </label>
                    <input
                      type="text"
                      value={coverLetter.companyAddress}
                      onChange={(e) =>
                        setCoverLetter({
                          ...coverLetter,
                          companyAddress: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company Address"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Letter Content */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Mail size={20} />
                  Cover Letter Content
                </h3>
                <div className="mb-4">
                  <textarea
                    value={coverLetter.content}
                    onChange={(e) =>
                      setCoverLetter({
                        ...coverLetter,
                        content: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 resize-none"
                    placeholder="Write your cover letter content here..."
                  />
                </div>

                {/* AI Enhancement */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-600" />
                    AI Enhancement
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe what you want to enhance..."
                    />
                    <button
                      onClick={handleAIEnhance}
                      disabled={isGenerating}
                      className={`px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${
                        isGenerating ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isGenerating ? "Generating..." : "Enhance"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Example: "Highlight my 5 years of experience in project
                    management"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={saveCoverLetter}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Cover Letter
                </button>

                <PDFDownloadLink
                  document={
                    <CoverLetterPDF coverLetter={coverLetter} user={user} />
                  }
                  fileName="cover-letter.pdf"
                  className="flex-1"
                >
                  {({ loading }) => (
                    <button
                      className={`w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        "Generating PDF..."
                      ) : (
                        <>
                          <Download size={18} />
                          Export PDF
                        </>
                      )}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Eye size={24} className="text-blue-600" />
              Cover Letter Preview
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[80vh] bg-white">
              <div className="mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {user.name || "Your Name"}
                </h1>
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span>{user.email || "email@example.com"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{user.phone || "(123) 456-7890"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{user.location || "City, State"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-500" />
                      <span>{user.title || "Professional Title"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                <p>
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="mb-6">
                <p className="font-medium">
                  {coverLetter.recipient || "Hiring Manager"}
                </p>
                <p className="font-medium">
                  {coverLetter.company || "Company Name"}
                </p>
                <p className="text-gray-600">
                  {coverLetter.companyAddress || "Company Address"}
                </p>
              </div>

              <div className="mb-4">
                <p>
                  Dear{" "}
                  {coverLetter.recipient
                    ? coverLetter.recipient.split(" ")[0]
                    : "Hiring Manager"}
                  ,
                </p>
              </div>

              <div className="text-gray-700 mb-8 whitespace-pre-line">
                {coverLetter.content ||
                  "Your cover letter content will appear here. Start typing or use the AI enhancement to generate professional content."}
              </div>

              <div className="mb-4">
                <p>Sincerely,</p>
              </div>

              <div>
                <p className="font-medium">{user.name || "Your Name"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CoverLetterBuilder;
