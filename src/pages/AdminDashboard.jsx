import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2,
  LogOut,
  Menu,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Settings,
  Bell,
  RefreshCw,
  MapPin,
  Droplets,
  Construction,
  Activity,
  Award,
  Target,
  FileText,
  Eye,
  Loader
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // ✅ STATE FOR LIVE DATA
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlerts, setShowAlerts] = useState(false);

  // Check admin authorization
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      alert("❌ Admin access only");
      navigate("/");
    }
  }, [navigate]);

  // ✅ FETCH LIVE DATA FROM BACKEND
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats');
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch recent complaints
      const complaintsRes = await fetch('http://localhost:5000/api/admin/complaints');
      if (!complaintsRes.ok) throw new Error('Failed to fetch complaints');
      const complaintsData = await complaintsRes.json();
      setRecentComplaints(complaintsData.complaints || []);

      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
      setLoading(false);
      
      // Show user-friendly error
      alert('⚠️ Could not connect to backend. Make sure Flask is running on http://localhost:5000');
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Admin info
  const adminInfo = {
    name: 'Administrator',
    role: 'System Admin',
    employeeId: 'ADMIN-001',
    email: localStorage.getItem('userEmail') || 'admin@civicportal.gov.in'
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
      resolved: 'bg-green-100 text-green-800 border-green-200'
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

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Fetching data from backend</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchDashboardData}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry Connection
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
            >
              Back to Home
            </button>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-left">
            <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Troubleshooting:</p>
            <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Make sure Flask backend is running: <code className="bg-yellow-100 px-1 rounded">python app.py</code></li>
              <li>Backend should be at: <code className="bg-yellow-100 px-1 rounded">http://localhost:5000</code></li>
              <li>Check console (F12) for CORS errors</li>
            </ol>
          </div>
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
              <Building2 className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">System Administration</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Refresh Button */}
              <button
                onClick={fetchDashboardData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Last updated: {lastUpdated || 'Never'}
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {stats?.criticalIssues > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.criticalIssues}
                  </span>
                )}
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{adminInfo.name}</p>
                  <p className="text-xs text-gray-600">{adminInfo.role}</p>
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
                <div className="px-4 py-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{adminInfo.name}</p>
                  <p className="text-xs text-gray-600">{adminInfo.email}</p>
                </div>
                <button
                  onClick={fetchDashboardData}
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

      {/* Critical Alerts Banner */}
      {stats?.criticalIssues > 0 && showAlerts && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-red-800">
                  {stats.criticalIssues} Critical Issues Require Immediate Attention
                </span>
              </div>
              <button
                onClick={() => setShowAlerts(false)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Complaints */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-10 h-10 text-blue-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats?.totalComplaints || 0}</p>
                <p className="text-sm text-gray-600">Total Complaints</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>All time</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats?.pendingComplaints || 0}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-yellow-700">
              <AlertCircle className="w-4 h-4" />
              <span>Awaiting action</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-10 h-10 text-blue-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats?.inProgressComplaints || 0}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <RefreshCw className="w-4 h-4" />
              <span>Being resolved</span>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats?.resolvedComplaints || 0}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-700">
              <Award className="w-4 h-4" />
              <span>{stats?.satisfactionRate || 0}% satisfaction</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <Users className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-sm opacity-90">Total Citizens</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <Shield className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats?.totalOfficers || 0}</p>
                <p className="text-sm opacity-90">Active Officers</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <MapPin className="w-10 h-10 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats?.totalWards || 0}</p>
                <p className="text-sm opacity-90">Wards Covered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Avg Resolution Time</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats?.avgResolutionTime || 0}h</p>
            <p className="text-sm text-gray-600 mt-2">Average time to resolve complaints</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">Satisfaction Rate</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">{stats?.satisfactionRate || 0}%</p>
            <p className="text-sm text-gray-600 mt-2">Citizen satisfaction with resolutions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Critical Issues</h3>
            </div>
            <p className="text-4xl font-bold text-red-600">{stats?.criticalIssues || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Require immediate attention</p>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
              <p className="text-sm text-gray-600">Latest 10 complaints submitted</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            {recentComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No complaints found</p>
                <p className="text-sm text-gray-500 mt-2">Complaints will appear here once submitted</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ward</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentComplaints.map((complaint, index) => (
                    <tr key={complaint.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">#{complaint.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{complaint.name}</div>
                        <div className="text-xs text-gray-500">{complaint.mobile}</div>
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
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => alert(`Viewing details for complaint #${complaint.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Admin Dashboard • Last updated: {lastUpdated || 'Loading...'}</p>
          <p className="mt-1">Backend: <span className="font-mono text-blue-600">http://localhost:5000</span></p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;