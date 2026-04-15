import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Upload, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Camera,
  Loader,
  Building2,
  LogIn,
  Menu,
  Home as HomeIcon,
  Droplets,
  Construction,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const CitizenPortal = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedComplaintId, setSubmittedComplaintId] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    ward: '',
    category: '',
    issueType: '',
    location: '',
    description: '',
    landmark: ''
  });

  const categories = [
    { value: 'road', label: 'Road Issues', icon: Construction, color: 'text-blue-600' },
    { value: 'water', label: 'Water Issues', icon: Droplets, color: 'text-cyan-600' }
  ];

  const roadIssues = [
    'Pothole',
    'Broken Road',
    'Street Light Not Working',
    'Manhole Cover Missing',
    'Road Blockage',
    'Traffic Signal Issue',
    'Other Road Issue'
  ];

  const waterIssues = [
    'Water Leakage',
    'No Water Supply',
    'Drainage Block',
    'Sewage Overflow',
    'Broken Water Pipe',
    'Water Quality Issue',
    'Other Water Issue'
  ];

  const wardOptions = Array.from({ length: 50 }, (_, i) => `Ward ${i + 1}`);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { issueType: '' } : {})
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for image upload
      const formDataPayload = new FormData();
      
      formDataPayload.append('name', formData.name);
      formDataPayload.append('mobile', formData.mobile);
      formDataPayload.append('email', formData.email || '');
      formDataPayload.append('ward', formData.ward);
      formDataPayload.append('category', formData.category);
      formDataPayload.append('issueType', formData.issueType);
      formDataPayload.append('location', formData.location);
      formDataPayload.append('description', formData.description);
      formDataPayload.append('landmark', formData.landmark || '');

      // Add image if uploaded
      if (uploadedFiles.length > 0) {
        formDataPayload.append('image', uploadedFiles[0].file);
      }

      console.log("📤 Submitting complaint...");

      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        body: formDataPayload
      });

      const data = await res.json();
      console.log("✅ Response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit");
      }

      // Store AI analysis
      setSubmittedComplaintId(data.complaintId);
      setAiAnalysis(data.aiAnalysis);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: '', mobile: '', email: '', ward: '',
          category: '', issueType: '',
          location: '', description: '', landmark: ''
        });
        setUploadedFiles([]);
        setAiAnalysis(null);
      }, 5000);

    } catch (error) {
      console.error("❌ Submit Error:", error);
      alert(`❌ Failed to submit complaint\n\nError: ${error.message}\n\nMake sure:\n1. Backend is running (python app.py)\n2. All required fields are filled\n3. Category and Issue Type are selected`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIssueTypes = () => {
    return formData.category === 'road' ? roadIssues : formData.category === 'water' ? waterIssues : [];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Civic Portal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <HomeIcon className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => navigate('/track-complaint')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Track Complaint
              </button>
              {/* FIXED: Login button now goes to home instead of /login */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => { navigate('/track-complaint'); setIsMobileMenuOpen(false); }}
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 text-left"
                >
                  Track Complaint
                </button>
                {/* FIXED: Mobile login also goes to home */}
                <button
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold mx-4"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">AI-Powered Severity Detection</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Report a Civic Issue
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our AI automatically determines issue severity based on your image and description.
            <br />
            <span className="text-blue-600 font-semibold">Just upload, submit, and our AI does the rest!</span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Upload Photo</h3>
              <p className="text-sm text-gray-600">AI analyzes image for damage assessment</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Detection</h3>
              <p className="text-sm text-gray-600">Automatic severity classification</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Routing</h3>
              <p className="text-sm text-gray-600">Sent to right officer automatically</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Complaint Registration Form</h2>
              <p className="text-blue-100">AI will automatically detect severity from your image and description</p>
            </div>

            {/* Form Body */}
            <div className="p-8 space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="10-digit mobile"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ward <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white"
                        required
                      >
                        <option value="">Select Ward</option>
                        {wardOptions.map((ward, index) => (
                          <option key={index} value={ward}>{ward}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Issue Details
                </h3>
                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => handleInputChange({ target: { name: 'category', value: cat.value } })}
                          className={`p-6 rounded-xl border-2 transition-all text-left ${
                            formData.category === cat.value
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${formData.category === cat.value ? 'bg-blue-600' : 'bg-gray-100'} flex items-center justify-center`}>
                              <cat.icon className={`w-6 h-6 ${formData.category === cat.value ? 'text-white' : cat.color}`} />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{cat.label}</div>
                              <div className="text-sm text-gray-600">
                                {cat.value === 'road' ? 'Roads & Infrastructure' : 'Water & Drainage'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Issue Type */}
                  {formData.category && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Issue Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="issueType"
                          value={formData.issueType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white"
                          required
                        >
                          <option value="">Select Issue Type</option>
                          {getIssueTypes().map((issue, index) => (
                            <option key={index} value={issue}>{issue}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location / Area <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          placeholder="Street name, area"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nearby Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="e.g., Near City Mall"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                      placeholder="Describe the issue in detail... When did you first notice it? How severe is the damage? Any safety concerns?"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Photo Evidence (Recommended for AI Analysis)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a photo for best AI severity detection. Our AI will analyze the damage automatically.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all bg-gray-50">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Upload Image</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Click to browse or drag and drop
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          JPG, PNG, GIF
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Uploaded ({uploadedFiles.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Info Box */}
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">AI Severity Detection</h4>
                      <p className="text-sm text-purple-700">
                        Our AI will analyze your image and issue details to automatically determine severity level:
                        <span className="font-semibold"> Low, Medium, High, or Critical</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      AI Analyzing & Submitting...
                    </>
                  ) : (
                    <>
                      Submit Complaint
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-600 mt-4">
                  AI will automatically detect severity • No manual selection needed
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Complaint Submitted!</h2>
            <p className="text-gray-600 mb-2">
              Your complaint has been registered successfully.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Complaint ID: <span className="font-bold text-blue-600">{submittedComplaintId}</span>
            </p>
            
            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-purple-900">AI Analysis Complete</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Detected Severity:</span>
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      aiAnalysis.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      aiAnalysis.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      aiAnalysis.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {aiAnalysis.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">AI Confidence:</span>
                    <span className="font-semibold text-purple-900">{aiAnalysis.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Image Analyzed:</span>
                    <span className="font-semibold text-purple-900">
                      {aiAnalysis.imageAnalyzed ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                You will receive updates via SMS. Track your complaint anytime.
              </p>
            </div>
            <button
              onClick={() => navigate('/track-complaint')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Track Complaint Status
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Civic Portal</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            © 2026 Civic Portal. Powered by AI. A Government Initiative.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm text-gray-400">AI System Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CitizenPortal;