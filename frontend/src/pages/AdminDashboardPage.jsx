/**
 * Admin Dashboard Page
 * Full-featured dashboard for viewing and managing contact form submissions
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, LogOut, Users, Mail, CheckCircle2, Archive,
  Search, RefreshCw, Eye, Trash2, ChevronLeft, ChevronRight,
  X, Clock, Inbox, Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    new:      { cls: 'badge-new', label: 'New' },
    read:     { cls: 'badge-read', label: 'Read' },
    replied:  { cls: 'badge-replied', label: 'Replied' },
    archived: { cls: 'badge-archived', label: 'Archived' },
  };
  const { cls, label } = config[status] || config.new;
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="stat-card rounded-2xl p-5"
  >
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="font-heading font-bold text-3xl text-white">{value ?? '—'}</div>
    <div className="text-sm text-white/50 mt-0.5">{label}</div>
  </motion.div>
);

// ─── Submission Detail Modal ──────────────────────────────────
const SubmissionModal = ({ submission, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(submission.status);
  const [notes, setNotes] = useState(submission.adminNotes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await contactAPI.updateStatus(submission._id, { status, adminNotes: notes });
      onStatusChange(submission._id, status, notes);
      toast.success('Submission updated!');
      onClose();
    } catch {
      toast.error('Failed to update submission.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 id="modal-title" className="font-heading font-bold text-lg text-white">
            Submission Details
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Full Name</p>
              <p className="text-sm text-white font-medium">{submission.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Email</p>
              <p className="text-sm text-violet-300 break-all">{submission.email}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-white/40 mb-1">Submitted At</p>
            <p className="text-sm text-white/70 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              {new Date(submission.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium', timeStyle: 'short'
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-white/40 mb-1">Message</p>
            <div className="bg-white/5 rounded-xl p-4 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
              {submission.message}
            </div>
          </div>

          {/* Status update */}
          <div>
            <p className="text-xs text-white/40 mb-1.5">Update Status</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-input w-full px-3 py-2 rounded-xl text-sm text-white"
              aria-label="Update submission status"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs text-white/40 mb-1.5">Admin Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes..."
              className="form-input w-full px-3 py-2 rounded-xl text-sm text-white resize-none"
              aria-label="Admin notes"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────
const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await contactAPI.getStats();
      if (data.success) setStats(data.data.stats);
    } catch {
      /* silent fail */
    }
  }, []);

  // Fetch submissions with filters
  const fetchSubmissions = useCallback(async (page = 1) => {
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const { data } = await contactAPI.getAll(params);
      if (data.success) {
        setSubmissions(data.data);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load submissions.');
    }
  }, [search, statusFilter]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchSubmissions(1)]);
      setIsLoading(false);
    };
    init();
  }, [fetchStats, fetchSubmissions]);

  // Re-fetch on filter change
  useEffect(() => {
    setCurrentPage(1);
    fetchSubmissions(1);
  }, [search, statusFilter, fetchSubmissions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStats(), fetchSubmissions(currentPage)]);
    setIsRefreshing(false);
    toast.success('Data refreshed!');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSubmissions(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    try {
      await contactAPI.delete(id);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      fetchStats();
      toast.success('Submission deleted.');
    } catch {
      toast.error('Failed to delete submission.');
    }
  };

  const handleStatusChange = (id, newStatus, notes) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, status: newStatus, adminNotes: notes } : s
      )
    );
    fetchStats();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e]">
      {/* Fixed background */}
      <div className="fixed inset-0 grid-overlay opacity-20 pointer-events-none" />

      {/* ─── Sidebar / Top Nav ─────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0f0a1e]/90 backdrop-blur-xl border-b border-white/8 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm">She Can Foundation</p>
                <p className="text-xs text-white/40 flex items-center gap-1">
                  <LayoutDashboard className="w-3 h-3" /> Admin Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-40"
                aria-label="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-white font-medium">{admin?.name}</p>
                <p className="text-xs text-white/40">{admin?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:border-rose-500/40 hover:bg-rose-500/10 transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ─── Stats Grid ──────────────────────────────────── */}
        <section aria-label="Dashboard statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Inbox}        label="Total Submissions" value={stats?.total}   color="bg-gradient-to-br from-violet-600 to-purple-700" />
          <StatCard icon={Mail}         label="New"               value={stats?.new}     color="bg-gradient-to-br from-fuchsia-600 to-pink-600" />
          <StatCard icon={Eye}          label="Read"              value={stats?.read}     color="bg-gradient-to-br from-sky-600 to-blue-700" />
          <StatCard icon={CheckCircle2} label="Replied"           value={stats?.replied}  color="bg-gradient-to-br from-emerald-600 to-teal-700" />
        </section>

        {/* ─── Submissions Table ───────────────────────────── */}
        <section
          className="glass-card rounded-2xl overflow-hidden"
          aria-label="Contact submissions"
        >
          {/* Toolbar */}
          <div className="p-5 border-b border-white/8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              Submissions
              {stats?.total > 0 && (
                <span className="text-sm font-normal text-white/40">({stats.total})</span>
              )}
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="form-input pl-9 pr-4 py-2 rounded-xl text-sm text-white w-full sm:w-56"
                  aria-label="Search submissions"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input px-3 py-2 rounded-xl text-sm text-white"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {submissions.length === 0 ? (
              <div className="py-20 text-center">
                <Archive className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-sm">No submissions found.</p>
              </div>
            ) : (
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">#</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Message</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <motion.tr
                      key={sub._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-white/5 table-row-hover cursor-pointer"
                      onClick={() => setSelectedSubmission(sub)}
                      role="row"
                    >
                      <td className="px-5 py-4 text-xs text-white/30">
                        {(currentPage - 1) * 10 + idx + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {sub.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-white truncate max-w-[120px]">
                            {sub.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-violet-300 truncate max-w-[180px] block">
                          {sub.email}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-white/50 truncate max-w-[200px] block">
                          {sub.message}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-xs text-white/40">
                          {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                            aria-label={`View submission from ${sub.fullName}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            aria-label={`Delete submission from ${sub.fullName}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-white/8 flex items-center justify-between">
              <p className="text-xs text-white/40">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - currentPage) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        p === currentPage
                          ? 'bg-violet-600 text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/8'
                      }`}
                      aria-label={`Page ${p}`}
                      aria-current={p === currentPage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <SubmissionModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardPage;
