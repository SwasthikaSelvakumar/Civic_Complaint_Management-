import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  TrendingUp,
  Shield,
  Bell,
  RefreshCw,
  MapPin,
  Droplets,
  Construction,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Play,
  User,
  Phone,
  Mail,
  Calendar,
  Loader,
  ChevronDown,
  Image as ImageIcon,
  Download,
  Send
} from 'lucide-react';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  
  // Auth & User Info
  const [officerInfo] = useState({
    name: 'Officer Name',
    email: localStorage.getItem('userEmail') || 'officer@civicportal.gov.in',
    ward: 'Ward 12',
    badge: 'OFF-2401'
  });

  // State Management
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Check officer authorization
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "officer") {
      alert("❌ Officer access only");
      navigate("/");
    }
  }, [navigate]);

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/complaints");
      if (!response.ok) throw new Error('Failed to fetch complaints');
      
      const data = await response.json();
      setComplaints(data.complaints || []);
      setFilteredComplaints(data.complaints || []);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
      alert('⚠️ Could not connect to backend. Make sure Flask is running on http://localhost:5000');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = complaints;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(c => c.severity === severityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    setFilteredComplaints(filtered);
  }, [searchTerm, statusFilter, severityFilter, categoryFilter, complaints]);

  // Stats calculation
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    critical: complaints.filter(c => c.severity === 'critical').length
  };

  // ✅ APPROVE COMPLAINT
  const handleApprove = async (complaintId) => {
    if (!window.confirm('Approve this complaint and move to In Progress?')) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/complaints/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaintId, status: 'in-progress' })
      });

      if (!response.ok) throw new Error('Failed to approve');
      
      alert('✅ Complaint Approved!');
      fetchComplaints();
      setShowDetailsModal(false);
    } catch (err) {
      alert('❌ Failed to approve: ' + err.message);
    }
  };

  // ❌ DENY COMPLAINT
  const handleDeny = async (complaintId) => {
    const reason = window.prompt('Enter reason for denial:');
    if (!reason) return;
    
    try {
      // In a real app, you'd store the denial reason
      const response = await fetch('http://localhost:5000/api/complaints/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaintId, status: 'denied' })
      });

      if (!response.ok) throw new Error('Failed to deny');
      
      alert(`❌ Complaint Denied\nReason: ${reason}`);
      fetchComplaints();
      setShowDetailsModal(false);
    } catch (err) {
      alert('❌ Failed to deny: ' + err.message);
    }
  };

  // ✅ MARK AS RESOLVED
  const handleResolve = async (complaintId) => {
    if (!window.confirm('Mark this complaint as Resolved?')) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/complaints/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaintId, status: 'resolved' })
      });

      if (!response.ok) throw new Error('Failed to resolve');
      
      alert('✅ Complaint Resolved!');
      fetchComplaints();
      setShowDetailsModal(false);
    } catch (err) {
      alert('❌ Failed to resolve: ' + err.message);
    }
  };

  // 📝 ADD NOTE
  const handleAddNote = async () => {
    if (!currentNote.trim()) {
      alert('Please enter a note');
      return;
    }

    // In a real app, you'd save notes to database
    alert(`✅ Note Added:\n${currentNote}`);
    setCurrentNote('');
    setShowNoteModal(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      alert('✅ Logged out successfully');
      navigate('/');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      denied: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      'in-progress': Play,
      resolved: CheckCircle2,
      denied: XCircle
    };
    return icons[status] || AlertCircle;
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Fetching complaints from backend</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchComplaints}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Officer Dashboard</h1>
                <p className="text-xs text-gray-500">Complaint Management</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Refresh Button */}
              <button
                onClick={fetchComplaints}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Last updated: {lastUpdated || 'Never'}
                </span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {stats.critical > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.critical}
                  </span>
                )}
              </button>

              {/* Officer Profile */}
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{officerInfo.name}</p>
                  <p className="text-xs text-gray-600">{officerInfo.ward}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="px-4 py-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{officerInfo.name}</p>
                  <p className="text-xs text-gray-600">{officerInfo.email}</p>
                </div>
                <button
                  onClick={fetchComplaints}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <span>Refresh Data</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <FileText className="w-10 h-10 text-blue-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <Clock className="w-10 h-10 text-yellow-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <Play className="w-10 h-10 text-blue-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.critical}</p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                >
                  <option value="all">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="road">Road Issues</option>
                  <option value="water">Water Issues</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Complaints ({filteredComplaints.length})</h2>
              <p className="text-sm text-gray-600">Manage and resolve citizen complaints</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No complaints found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Citizen</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Issue</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ward</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => {
                    const StatusIcon = getStatusIcon(complaint.status);
                    return (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900">#{complaint.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{complaint.name}</div>
                              <div className="text-xs text-gray-500">{complaint.mobile}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {complaint.category === 'road' ? (
                              <Construction className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Droplets className="w-4 h-4 text-cyan-600" />
                            )}
                            <span className="text-sm text-gray-900 capitalize">{complaint.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{complaint.issueType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{complaint.ward}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(complaint.severity)}`}>
                            {complaint.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 w-fit ${getStatusColor(complaint.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* View Details */}
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* Quick Actions */}
                            {complaint.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(complaint.id)}
                                  className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                  title="Approve"
                                >
                                  <ThumbsUp className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeny(complaint.id)}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                  title="Deny"
                                >
                                  <ThumbsDown className="w-5 h-5" />
                                </button>
                              </>
                            )}

                            {complaint.status === 'in-progress' && (
                              <button
                                onClick={() => handleResolve(complaint.id)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                title="Mark Resolved"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}

                            {/* Add Note */}
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowNoteModal(true);
                              }}
                              className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600"
                              title="Add Note"
                            >
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">Complaint Details</h2>
                  <p className="text-sm text-emerald-100">#{selectedComplaint.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Citizen Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Citizen Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-semibold">{selectedComplaint.name}</span></div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {selectedComplaint.mobile}</div>
                    {selectedComplaint.email && (
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {selectedComplaint.email}</div>
                    )}
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {selectedComplaint.ward}</div>
                  </div>
                </div>

                {/* Issue Details */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-emerald-600" />
                    Issue Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 w-32">Category:</span>
                      <div className="flex items-center gap-2">
                        {selectedComplaint.category === 'road' ? (
                          <Construction className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Droplets className="w-4 h-4 text-cyan-600" />
                        )}
                        <span className="font-semibold capitalize">{selectedComplaint.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 w-32">Issue Type:</span>
                      <span className="font-semibold">{selectedComplaint.issueType}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 w-32">Severity:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedComplaint.severity)}`}>
                        {selectedComplaint.severity}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 w-32">Status:</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 w-32">Location:</span>
                      <span className="font-semibold">{selectedComplaint.location}</span>
                    </div>
                    {selectedComplaint.landmark && (
                      <div className="flex gap-2">
                        <span className="text-sm text-gray-600 w-32">Landmark:</span>
                        <span className="font-semibold">{selectedComplaint.landmark}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600 w-32">Date:</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">
                          {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                  {selectedComplaint.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(selectedComplaint.id)}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        Approve & Start Progress
                      </button>
                      <button
                        onClick={() => handleDeny(selectedComplaint.id)}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <ThumbsDown className="w-5 h-5" />
                        Deny Complaint
                      </button>
                    </>
                  )}

                  {selectedComplaint.status === 'in-progress' && (
                    <button
                      onClick={() => handleResolve(selectedComplaint.id)}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Resolved
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowNoteModal(true);
                    }}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note Modal */}
        {showNoteModal && selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-purple-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">Add Note</h2>
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setCurrentNote('');
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Complaint: <span className="font-semibold text-gray-900">#{selectedComplaint.id}</span>
                </p>
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                ></textarea>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteModal(false);
                      setCurrentNote('');
                    }}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Officer Dashboard • Last updated: {lastUpdated || 'Loading...'}</p>
          <p className="mt-1">Backend: <span className="font-mono text-emerald-600">http://localhost:5000</span></p>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;