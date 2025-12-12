import {
  X,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Upload,
  Check,
  Calendar,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface SignUpModalProps {
  onClose: () => void;
  onSignUp: () => void;
  defaultUserType?: "client" | "consultant";
}

type UserType = "client" | "consultant" | null;

export function SignUpModal({
  onClose,
  onSignUp,
  defaultUserType,
}: SignUpModalProps) {
  const [userType, setUserType] = useState<UserType>(defaultUserType || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  // Client form data
  const [clientData, setClientData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    password: "",
  });

  // Consultant form data
  const [consultantData, setConsultantData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    yearsOfExperience: "",
    currentTitle: "",
    location: "",
    sapModules: [] as string[],
    certifications: [] as string[],
    skills: [] as string[],
    availability: "",
    hourlyRate: "",
    resume: null as File | null,
  });

  const sapModules = [
    "SAP S/4HANA",
    "SAP ERP",
    "SAP BW/4HANA",
    "SAP Fiori",
    "SAP ABAP",
    "SAP Basis",
    "SAP MM",
    "SAP SD",
    "SAP FI/CO",
    "SAP HCM",
    "SAP SCM",
    "SAP CRM",
  ];
  const certifications = [
    "SAP Certified Application Associate",
    "SAP Certified Development Associate",
    "SAP Certified Technology Associate",
    "SAP S/4HANA Certification",
    "SAP ABAP Certification",
  ];

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConsultantData({ ...consultantData, resume: file });
      setResumeUploaded(true);
      // Simulate auto-fill from resume
      setTimeout(() => {
        setConsultantData({
          ...consultantData,
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          yearsOfExperience: "8",
          currentTitle: "Senior SAP Consultant",
          location: "New York, NY",
          sapModules: ["SAP S/4HANA", "SAP Fiori", "SAP ABAP"],
          certifications: ["SAP Certified Application Associate"],
          skills: [
            "SAP Migration",
            "System Integration",
            "Process Optimization",
          ],
          resume: file,
        });
      }, 1000);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp();
  };

  const getTotalSteps = () => {
    if (!userType) return 1;
    return userType === "client" ? 3 : 5;
  };

  const canProceed = () => {
    if (!userType) return false;

    if (userType === "client") {
      if (currentStep === 2) {
        return (
          clientData.companyName &&
          clientData.industry &&
          clientData.companySize
        );
      }
      if (currentStep === 3) {
        return (
          clientData.firstName &&
          clientData.lastName &&
          clientData.email &&
          clientData.password
        );
      }
    } else {
      if (currentStep === 2) {
        return (
          consultantData.firstName &&
          consultantData.lastName &&
          consultantData.email &&
          consultantData.password
        );
      }
      if (currentStep === 3) {
        return (
          consultantData.yearsOfExperience &&
          consultantData.currentTitle &&
          consultantData.location
        );
      }
      if (currentStep === 4) {
        return consultantData.sapModules.length > 0;
      }
      if (currentStep === 5) {
        return consultantData.availability && consultantData.hourlyRate;
      }
    }
    return true;
  };

  const renderUserTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="mb-2 text-gray-900">Join Vertex9</h3>
        <p className="text-gray-600">
          Select how you’d like to join our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setUserType("client");
            setCurrentStep(2);
          }}
          className="group relative p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-500 transition-all hover:shadow-xl"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-900">I’m a Client</h4>
              <p className="text-sm text-gray-600">
                Looking to hire SAP consultants for my projects
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setUserType("consultant");
            setCurrentStep(2);
          }}
          className="group relative p-8 border-2 border-gray-200 rounded-2xl hover:border-purple-500 transition-all hover:shadow-xl"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-900">I’m a Consultant</h4>
              <p className="text-sm text-gray-600">
                Looking to find SAP consulting opportunities
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderClientStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="mb-2 text-gray-900">Company Information</h3>
        <p className="text-sm text-gray-600">Tell us about your organization</p>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={clientData.companyName}
          onChange={(e) =>
            setClientData({ ...clientData, companyName: e.target.value })
          }
          placeholder="Acme Corporation"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Industry *</label>
        <select
          value={clientData.industry}
          onChange={(e) =>
            setClientData({ ...clientData, industry: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select industry</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="retail">Retail</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="technology">Technology</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Company Size *
        </label>
        <select
          value={clientData.companySize}
          onChange={(e) =>
            setClientData({ ...clientData, companySize: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501-1000">501-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Website (Optional)
        </label>
        <input
          type="url"
          value={clientData.website}
          onChange={(e) =>
            setClientData({ ...clientData, website: e.target.value })
          }
          placeholder="https://www.company.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderClientStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="mb-2 text-gray-900">Your Information</h3>
        <p className="text-sm text-gray-600">Create your account</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={clientData.firstName}
            onChange={(e) =>
              setClientData({ ...clientData, firstName: e.target.value })
            }
            placeholder="John"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={clientData.lastName}
            onChange={(e) =>
              setClientData({ ...clientData, lastName: e.target.value })
            }
            placeholder="Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Position *</label>
        <input
          type="text"
          value={clientData.position}
          onChange={(e) =>
            setClientData({ ...clientData, position: e.target.value })
          }
          placeholder="IT Manager"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={clientData.email}
            onChange={(e) =>
              setClientData({ ...clientData, email: e.target.value })
            }
            placeholder="you@company.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Phone *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={clientData.phone}
            onChange={(e) =>
              setClientData({ ...clientData, phone: e.target.value })
            }
            placeholder="+1 (555) 123-4567"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Password *</label>
        <input
          type="password"
          value={clientData.password}
          onChange={(e) =>
            setClientData({ ...clientData, password: e.target.value })
          }
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );

  const renderConsultantStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="mb-2 text-gray-900">Get Started</h3>
        <p className="text-sm text-gray-600">
          Upload your resume or fill manually
        </p>
      </div>

      {/* Resume Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center space-y-4">
            {resumeUploaded ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-green-600 mb-1">Resume Uploaded!</p>
                  <p className="text-sm text-gray-600">
                    Your information has been auto-filled
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Upload Your Resume</p>
                  <p className="text-sm text-gray-600">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or enter manually</span>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={consultantData.firstName}
            onChange={(e) =>
              setConsultantData({
                ...consultantData,
                firstName: e.target.value,
              })
            }
            placeholder="John"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={consultantData.lastName}
            onChange={(e) =>
              setConsultantData({ ...consultantData, lastName: e.target.value })
            }
            placeholder="Smith"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={consultantData.email}
            onChange={(e) =>
              setConsultantData({ ...consultantData, email: e.target.value })
            }
            placeholder="you@email.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Phone *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={consultantData.phone}
            onChange={(e) =>
              setConsultantData({ ...consultantData, phone: e.target.value })
            }
            placeholder="+1 (555) 123-4567"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Password *</label>
        <input
          type="password"
          value={consultantData.password}
          onChange={(e) =>
            setConsultantData({ ...consultantData, password: e.target.value })
          }
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );

  const renderConsultantStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="mb-2 text-gray-900">Professional Experience</h3>
        <p className="text-sm text-gray-600">Tell us about your background</p>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Years of SAP Experience *
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            value={consultantData.yearsOfExperience}
            onChange={(e) =>
              setConsultantData({
                ...consultantData,
                yearsOfExperience: e.target.value,
              })
            }
            placeholder="5"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Current Title *
        </label>
        <input
          type="text"
          value={consultantData.currentTitle}
          onChange={(e) =>
            setConsultantData({
              ...consultantData,
              currentTitle: e.target.value,
            })
          }
          placeholder="Senior SAP Consultant"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Location *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={consultantData.location}
            onChange={(e) =>
              setConsultantData({ ...consultantData, location: e.target.value })
            }
            placeholder="New York, NY"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Key Skills (Select multiple)
        </label>
        <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {[
              "SAP Migration",
              "System Integration",
              "Process Optimization",
              "Technical Architecture",
              "Business Analysis",
              "Project Management",
            ].map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() =>
                  setConsultantData({
                    ...consultantData,
                    skills: toggleArrayItem(consultantData.skills, skill),
                  })
                }
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  consultantData.skills.includes(skill)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsultantStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="mb-2 text-gray-900">SAP Expertise</h3>
        <p className="text-sm text-gray-600">Select your areas of expertise</p>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          SAP Modules * (Select all that apply)
        </label>
        <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {sapModules.map((module) => (
              <label
                key={module}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  consultantData.sapModules.includes(module)
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={consultantData.sapModules.includes(module)}
                  onChange={() =>
                    setConsultantData({
                      ...consultantData,
                      sapModules: toggleArrayItem(
                        consultantData.sapModules,
                        module
                      ),
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-900">{module}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Certifications (Optional)
        </label>
        <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {certifications.map((cert) => (
              <label key={cert} className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={consultantData.certifications.includes(cert)}
                  onChange={() =>
                    setConsultantData({
                      ...consultantData,
                      certifications: toggleArrayItem(
                        consultantData.certifications,
                        cert
                      ),
                    })
                  }
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">{cert}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsultantStep5 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="mb-2 text-gray-900">Availability & Rate</h3>
        <p className="text-sm text-gray-600">
          Final details to complete your profile
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Availability *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={consultantData.availability}
            onChange={(e) =>
              setConsultantData({
                ...consultantData,
                availability: e.target.value,
              })
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select availability</option>
            <option value="immediate">Immediate (Available Now)</option>
            <option value="2-weeks">2 Weeks Notice</option>
            <option value="1-month">1 Month Notice</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Hourly Rate (USD) *
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            value={consultantData.hourlyRate}
            onChange={(e) =>
              setConsultantData({
                ...consultantData,
                hourlyRate: e.target.value,
              })
            }
            placeholder="150"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This is your standard rate. You can negotiate project-specific rates
          with clients.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900">Almost there!</p>
            <p className="text-xs text-blue-700 mt-1">
              After submission, our team will review your profile within 24-48
              hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (currentStep === 1) {
      return renderUserTypeSelection();
    }

    if (userType === "client") {
      if (currentStep === 2) return renderClientStep2();
      if (currentStep === 3) return renderClientStep3();
    }

    if (userType === "consultant") {
      if (currentStep === 2) return renderConsultantStep2();
      if (currentStep === 3) return renderConsultantStep3();
      if (currentStep === 4) return renderConsultantStep4();
      if (currentStep === 5) return renderConsultantStep5();
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/vx9-logo-02.png"
              alt="Vertex9 Systems"
              width={160}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>

          {/* Progress Bar */}
          {userType && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {getTotalSteps()}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round((currentStep / getTotalSteps()) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 2 && userType) {
                      setUserType(null);
                      setCurrentStep(1);
                    } else {
                      setCurrentStep(currentStep - 1);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}

              {currentStep < getTotalSteps() ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    canProceed()
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    canProceed()
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-5 h-5" />
                  Complete Sign Up
                </button>
              )}
            </div>
          </form>

          {currentStep === 1 && (
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
