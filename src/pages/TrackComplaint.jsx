import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2,
  LogIn,
  Menu,
  X,
  Home as HomeIcon,
  Search,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Share2,
  Droplets,
  Construction,
  TrendingUp,
  Loader,
  Mail,
  Shield,
  RefreshCw,
  Play
} from 'lucide-react';

const TrackComplaint = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // ✅ REAL BACKEND API CALL
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setSearchResult(null);

    try {
      console.log('🔍 Searching for complaint:', complaintId, mobileNumber);
      
      const response = await fetch(
        `http://localhost:5000/api/complaints/track?complaintId=${complaintId}&mobile=${mobileNumber}`
      );

      const data = await response.json();
      console.log('✅ Track API Response:', data);

      if (!response.ok || !data.success) {
        setError(data.message || '❌ Complaint not found. Please check your Complaint ID and mobile number.');
        setSearchResult(null);
        setIsSearching(false);
        return;
      }

      // Successfully found complaint
      setSearchResult(data.complaint);
      setError('');
      
    } catch (err) {
      console.error('❌ Track Error:', err);
      setError('⚠️ Server error. Please make sure the backend is running on http://localhost:5000');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'pending': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        icon: Clock, 
        label: 'Pending Review' 
      },
      'in-progress': { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        icon: Play, 
        label: 'In Progress' 
      },
      'resolved': { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        icon: CheckCircle2, 
        label: 'Resolved' 
      },
      'denied': { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        icon: XCircle, 
        label: 'Denied' 
      }
    };
    
    const c = config[status] || config.pending;
    const Icon = c.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${c.bg} ${c.text} font-semibold`}>
        <Icon className="w-5 h-5" />
        {c.label}
      </div>
    );
  };

  const getSeverityBadge = (severity) => {
    const config = {
      'low': { bg: 'bg-green-100', text: 'text-green-700', label: 'Low' },
      'medium': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
      'high': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
      'critical': { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' }
    };
    
    const c = config[severity] || config.low;
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Civic Portal</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <HomeIcon className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => navigate('/citizen')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Report Issue
              </button>
              <button
                onClick={() => navigate('/?login=true')}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-gray-700 px-4 py-2 text-left"
                >
                  <HomeIcon className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => { navigate('/citizen'); setIsMobileMenuOpen(false); }}
                  className="text-gray-700 px-4 py-2 text-left"
                >
                  Report Issue
                </button>
                <button
                  onClick={() => { navigate('/?login=true'); setIsMobileMenuOpen(false); }}
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
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop)',
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Track Complaint Status</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Track Your Complaint
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Enter your complaint ID and mobile number to check the real-time status of your civic issue
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <Search className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Search Instantly</h3>
              <p className="text-sm text-gray-600">Enter ID & mobile to track</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-sm text-gray-600">See live progress updates</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Secure Access</h3>
              <p className="text-sm text-gray-600">Verified with mobile number</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Search Your Complaint</h2>
              <p className="text-blue-100">Enter the details provided when you submitted the complaint</p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                    placeholder="e.g., CMP-A1B2C3"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none uppercase font-mono"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">The complaint ID was sent to you via SMS/Email after submission</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Use the same mobile number you provided when submitting the complaint</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-shake">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-semibold">{error}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Make sure backend is running: <code className="bg-red-100 px-1 rounded">python app.py</code>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Searching Database...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Track Complaint
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Search Result */}
          {searchResult && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Complaint Found! ✅</h3>
                    <p className="text-emerald-100 font-mono text-lg">ID: {searchResult.id}</p>
                  </div>
                  {getStatusBadge(searchResult.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Citizen Info */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Your Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{searchResult.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{searchResult.mobile}</span>
                    </div>
                    {searchResult.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{searchResult.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{searchResult.ward}</span>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Category & Type</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {searchResult.category === 'road' ? (
                        <Construction className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Droplets className="w-6 h-6 text-cyan-600" />
                      )}
                      <div>
                        <p className="text-sm text-gray-600 capitalize">{searchResult.category}</p>
                        <p className="font-bold text-gray-900">{searchResult.issueType}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Severity Level</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {getSeverityBadge(searchResult.severity)}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Location</label>
                    <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{searchResult.location}</p>
                        {searchResult.landmark && (
                          <p className="text-sm text-gray-600 mt-1">Near: {searchResult.landmark}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Submitted On</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 font-semibold">{formatDate(searchResult.createdAt)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Current Status</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {getStatusBadge(searchResult.status)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Issue Description</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed">{searchResult.description}</p>
                  </div>
                </div>

                {/* Status Message */}
                <div className={`p-4 rounded-lg border ${
                  searchResult.status === 'resolved' 
                    ? 'bg-green-50 border-green-200' 
                    : searchResult.status === 'in-progress'
                    ? 'bg-blue-50 border-blue-200'
                    : searchResult.status === 'denied'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {searchResult.status === 'resolved' && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                    {searchResult.status === 'in-progress' && <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                    {searchResult.status === 'denied' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    {searchResult.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className={`font-semibold ${
                        searchResult.status === 'resolved' ? 'text-green-800' :
                        searchResult.status === 'in-progress' ? 'text-blue-800' :
                        searchResult.status === 'denied' ? 'text-red-800' :
                        'text-yellow-800'
                      }`}>
                        {searchResult.status === 'resolved' && '✅ Complaint Resolved Successfully!'}
                        {searchResult.status === 'in-progress' && '🔄 Complaint is Being Processed'}
                        {searchResult.status === 'denied' && '❌ Complaint Was Denied'}
                        {searchResult.status === 'pending' && '⏳ Complaint Under Review'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        searchResult.status === 'resolved' ? 'text-green-700' :
                        searchResult.status === 'in-progress' ? 'text-blue-700' :
                        searchResult.status === 'denied' ? 'text-red-700' :
                        'text-yellow-700'
                      }`}>
                        {searchResult.status === 'resolved' && 'Thank you for reporting. The issue has been fixed by our team.'}
                        {searchResult.status === 'in-progress' && 'Our officers are currently working on resolving your complaint.'}
                        {searchResult.status === 'denied' && 'Please contact the ward officer for more information.'}
                        {searchResult.status === 'pending' && 'Your complaint will be assigned to an officer soon.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Complaint Status',
                          text: `Complaint ${searchResult.id} is ${searchResult.status}`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(`Complaint ${searchResult.id} - Status: ${searchResult.status}`);
                        alert('✅ Status copied to clipboard!');
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Status
                  </button>
                  <button 
                    onClick={() => {
                      setSearchResult(null);
                      setComplaintId('');
                      setMobileNumber('');
                      setError('');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-semibold transition-all"
                  >
                    <Search className="w-4 h-4" />
                    Track Another Complaint
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Civic Portal</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            © 2026 Civic Portal. All rights reserved. A Government of India Initiative.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm text-gray-400">System Status: Online</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TrackComplaint;