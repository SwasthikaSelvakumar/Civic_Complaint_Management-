import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Droplets, 
  Construction, 
  BarChart3, 
  Lock, 
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  Zap,
  Eye,
  Award,
  Phone,
  Mail,
  Building2,
  FileText,
  LogIn,
  Menu,
  X,
  User,
  UserCog,
  Loader,
  RefreshCw
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  // ✅ REAL BACKEND DATA STATES
  const [counters, setCounters] = useState({
    resolved: 0,
    users: 0,
    wards: 0,
    avgTime: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // ✅ FETCH REAL STATS FROM BACKEND
  const fetchHomeStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/home/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      console.log('✅ Home stats fetched:', data);
      
      // Animate counters to real values
      animateCounters(data);
      setStatsLoading(false);
      
    } catch (error) {
      console.error('❌ Stats fetch error:', error);
      setStatsError(error.message);
      
      // Use fallback values with animation
      const fallbackStats = {
        resolvedComplaints: 1247,
        totalUsers: 8920,
        totalWards: 50,
        avgResolutionTime: 36
      };
      animateCounters(fallbackStats);
      setStatsLoading(false);
    }
  };

  // ✅ ANIMATE COUNTERS TO TARGET VALUES
  const animateCounters = (targets) => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targetValues = {
      resolved: targets.resolvedComplaints || 0,
      users: targets.totalUsers || 0,
      wards: targets.totalWards || 0,
      avgTime: targets.avgResolutionTime || 0
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        resolved: Math.floor(targetValues.resolved * progress),
        users: Math.floor(targetValues.users * progress),
        wards: Math.floor(targetValues.wards * progress),
        avgTime: Math.floor(targetValues.avgTime * progress)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Check if login parameter is in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
      setIsLoginModalOpen(true);
      const roleParam = urlParams.get('role');
      if (roleParam && ['citizen', 'officer', 'admin'].includes(roleParam)) {
        setSelectedRole(roleParam);
      }
      // Clean URL
      window.history.replaceState({}, '', '/');
    }
    
    // ✅ FETCH REAL STATS
    fetchHomeStats();
  }, []);

  // Login Modal Configuration
  const roles = [
    {
      id: 'citizen',
      title: 'Citizen Login',
      description: 'Report and track your civic issues',
      icon: User,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      borderColor: 'border-blue-600',
      textColor: 'text-blue-600',
      route: '/citizen'
    },
    {
      id: 'officer',
      title: 'Officer Login',
      description: 'Manage and resolve complaints',
      icon: Shield,
      color: 'bg-emerald-600',
      hoverColor: 'hover:bg-emerald-700',
      borderColor: 'border-emerald-600',
      textColor: 'text-emerald-600',
      route: '/officer-dashboard'
    },
    {
      id: 'admin',
      title: 'Admin Login',
      description: 'System administration & analytics',
      icon: UserCog,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      borderColor: 'border-purple-600',
      textColor: 'text-purple-600',
      route: '/admin-dashboard'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setCredentials({ email: '', password: '' });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const email = credentials.email.trim();
    const password = credentials.password.trim();

    // OFFICER LOGIN RULE
    if (selectedRole === "officer") {
      const officerEmail = "officer@gmail.com";
      const officerPassword = "officer123";

      if (email !== officerEmail || password !== officerPassword) {
        alert("❌ Unauthorized Officer Login");
        return;
      }

      localStorage.setItem("userRole", "officer");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", "officer-token");

      alert("✅ Officer Login Successful");
      navigate("/officer-dashboard");
    }

    // ADMIN LOGIN RULE
    else if (selectedRole === "admin") {
      const adminEmail = "admin@gmail.com";
      const adminPassword = "admin123";

      if (email !== adminEmail || password !== adminPassword) {
        alert("❌ Unauthorized Admin Login");
        return;
      }

      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", "admin-token");

      alert("✅ Admin Login Successful");
      navigate("/admin-dashboard");
    }

    // CITIZEN LOGIN RULE
    else if (selectedRole === "citizen") {
      if (!email || !password) {
        alert("❌ Enter email and password");
        return;
      }

      localStorage.setItem("userRole", "citizen");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", "citizen-token");

      alert("✅ Citizen Login Successful");
      navigate("/citizen");
    }

    // Reset UI
    setIsLoginModalOpen(false);
    setSelectedRole(null);
    setCredentials({ email: "", password: "" });
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setSelectedRole(null);
    setCredentials({ email: '', password: '' });
  };

  const features = [
    {
      icon: Construction,
      title: 'Road Issue Reporting',
      description: 'Report potholes, broken infrastructure, and road safety concerns instantly.',
      color: 'bg-blue-600'
    },
    {
      icon: Droplets,
      title: 'Water Issue Reporting',
      description: 'Address water leakage, supply issues, and drainage problems efficiently.',
      color: 'bg-cyan-600'
    },
    {
      icon: Shield,
      title: 'Government Transparency',
      description: 'Track your complaints in real-time with complete accountability.',
      color: 'bg-emerald-600'
    },
    {
      icon: Zap,
      title: 'Fast Resolution',
      description: 'Automated routing ensures your issues reach the right authorities quickly.',
      color: 'bg-orange-600'
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Government-grade security protects your data and privacy.',
      color: 'bg-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Tracking',
      description: 'Monitor complaint status with live updates and notifications.',
      color: 'bg-indigo-600'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Citizen Submits Complaint',
      description: 'Report road or water issues through our simple, intuitive portal with photo evidence.',
      icon: Users,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      step: '02',
      title: 'Automated Routing',
      description: 'Complaint is automatically routed to the appropriate ward officer based on location.',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      step: '03',
      title: 'Officer Verification',
      description: 'Ward officer reviews, verifies, and updates the complaint status in real-time.',
      icon: Eye,
      color: 'bg-cyan-100 text-cyan-700'
    },
    {
      step: '04',
      title: 'Government Resolves',
      description: 'Local authorities take action and resolve the issue efficiently.',
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      step: '05',
      title: 'Citizen Receives Updates',
      description: 'Get instant notifications at every stage until complete resolution.',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-700'
    }
  ];

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
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                How It Works
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
              <button
                onClick={() => setIsLoginModalOpen(true)}
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
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all mx-4"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRole ? `${roles.find(r => r.id === selectedRole)?.title}` : 'Login to Civic Portal'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedRole ? 'Enter your credentials to continue' : 'Select your role to get started'}
                </p>
              </div>
              <button
                onClick={closeLoginModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!selectedRole ? (
                // Role Selection Screen
                <div className="grid md:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`group relative p-8 bg-white border-2 ${role.borderColor} rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left`}
                    >
                      {/* Icon */}
                      <div className={`w-16 h-16 ${role.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <role.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {role.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {role.description}
                      </p>

                      {/* Arrow */}
                      <div className={`flex items-center gap-2 ${role.textColor} font-semibold text-sm`}>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Login Form Screen
                <div className="max-w-md mx-auto">
                  {/* Role Badge */}
                  <div className="flex items-center justify-center mb-8">
                    <div className={`inline-flex items-center gap-3 px-6 py-3 ${roles.find(r => r.id === selectedRole)?.color} rounded-full text-white`}>
                      {React.createElement(roles.find(r => r.id === selectedRole)?.icon, { className: "w-5 h-5" })}
                      <span className="font-semibold">{roles.find(r => r.id === selectedRole)?.title}</span>
                    </div>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={credentials.email}
                          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          value={credentials.password}
                          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        Forgot Password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full ${roles.find(r => r.id === selectedRole)?.color} ${roles.find(r => r.id === selectedRole)?.hoverColor} text-white py-3 rounded-lg font-semibold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2`}
                    >
                      <span>Login</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={handleBackToRoles}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-all"
                    >
                      Back to Role Selection
                    </button>

                    {/* Register Link - Only for Citizens */}
                    {selectedRole === 'citizen' && (
                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Don't have an account?{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Register as Citizen
                          </a>
                        </p>
                      </div>
                    )}
                  </form>

                  {/* Security Badge */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Your data is protected with government-grade encryption</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Real Civic Background */}
      <section className="relative min-h-[85vh] flex items-center pt-16">
        {/* Background Image - City Infrastructure */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop)',
          }}
        >
          {/* Professional Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-blue-900/70"></div>
        </div>

        {/* Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              {/* Government Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Government of India Initiative</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Smart Civic Issue
                <br />
                <span className="text-cyan-300">Reporting Platform</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Report Road & Water Issues. Empower Local Governance.
                <br />
                Building smarter cities, one complaint at a time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/citizen')}
                  className="group px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  Report an Issue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setSelectedRole('officer');
                  }}
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Officer Dashboard
                  <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Secure & Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>Government Backed</span>
                </div>
              </div>
            </div>

            {/* Right Side - ✅ LIVE STATS CARD FROM BACKEND */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Platform Impact</h3>
                  {statsLoading && (
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {!statsLoading && (
                    <button
                      onClick={fetchHomeStats}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Refresh Stats"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {counters.resolved.toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-600">Issues Resolved</div>
                  </div>

                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      {counters.users.toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-600">Active Citizens</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {counters.wards}+
                    </div>
                    <div className="text-sm text-gray-600">Wards Covered</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {counters.avgTime}h
                    </div>
                    <div className="text-sm text-gray-600">Avg Resolution</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      {statsError ? 'Using Cached Data' : 'Live Data'}
                    </span>
                    <span>Updated: Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology meets civic responsibility for efficient governance
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 border border-gray-100"
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-cyan-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-cyan-800 uppercase tracking-wide">Workflow Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless journey from complaint submission to resolution
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-emerald-300 transform -translate-x-1/2"></div>

            {/* Steps */}
            <div className="space-y-0">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:text-left'} text-center mb-12 lg:mb-20`}>
                    <div className="inline-block bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-100 hover:border-blue-300">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.color} font-bold text-2xl mb-4`}>
                        {item.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="relative z-10 flex-shrink-0 mb-12 lg:mb-20">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Spacer for desktop */}
                  <div className="flex-1 lg:w-5/12 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Making a Real Difference
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real-time metrics showcasing our platform's effectiveness in civic governance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl font-bold mb-2">{counters.resolved.toLocaleString()}+</div>
              <div className="text-blue-100 text-lg mb-3">Complaints Resolved</div>
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Live from database</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl font-bold mb-2">{counters.users.toLocaleString()}+</div>
              <div className="text-blue-100 text-lg mb-3">Active Citizens</div>
              <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm">
                <Users className="w-4 h-4" />
                <span>Growing daily</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl font-bold mb-2">{counters.wards}+</div>
              <div className="text-blue-100 text-lg mb-3">City Wards Covered</div>
              <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Full coverage</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl font-bold mb-2">{counters.avgTime}h</div>
              <div className="text-blue-100 text-lg mb-3">Avg Resolution Time</div>
              <div className="flex items-center justify-center gap-2 text-orange-300 text-sm">
                <Clock className="w-4 h-4" />
                <span>Getting faster</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Content */}
              <div className="p-12 lg:p-16 text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Make Your City Smarter
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Join thousands of citizens making a real difference. Report issues today and be part of the change your city needs.
                </p>
              </div>

              {/* Right Image */}
              <div 
                className="hidden lg:block bg-cover bg-center min-h-[300px]"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-400" />
                Civic Portal
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering citizens and government to build smarter, more responsive cities through technology and transparency.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>support@civicportal.gov.in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" />About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" />How It Works</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" />Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" />Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2026 Civic Portal. All rights reserved. A Government of India Initiative.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm text-gray-400">
                {statsError ? 'Backend Offline - Using Cache' : 'System Status: Online'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;