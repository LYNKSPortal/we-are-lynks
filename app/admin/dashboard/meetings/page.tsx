'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, Plus, Calendar } from 'lucide-react';

interface Meeting {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  platform: string | null;
  timezone: string | null;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: string;
  created_at: string;
}

type FormState = {
  type: string;
  name: string;
  email: string;
  phone: string;
  platform: string;
  timezone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: string;
};

const emptyForm: FormState = {
  type: 'online',
  name: '',
  email: '',
  phone: '',
  platform: 'zoom',
  timezone: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
  status: 'confirmed',
};

function toFormState(meeting: Meeting): FormState {
  return {
    type: meeting.type,
    name: meeting.name,
    email: meeting.email,
    phone: meeting.phone,
    platform: meeting.platform || '',
    timezone: meeting.timezone || '',
    preferredDate: meeting.preferred_date?.slice(0, 10) || '',
    preferredTime: meeting.preferred_time?.slice(0, 5) || '',
    message: meeting.message || '',
    status: meeting.status,
  };
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showPast, setShowPast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/admin/meetings');
      const data = await response.json();
      setMeetings(data.data || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const visibleMeetings = useMemo(() => {
    return meetings.filter((m) => showPast || m.preferred_date?.slice(0, 10) >= today);
  }, [meetings, showPast, today]);

  const selectedMeeting = meetings.find((m) => m.id === selectedId) || null;

  const selectMeeting = (meeting: Meeting) => {
    setIsCreating(false);
    setSelectedId(meeting.id);
    setForm(toFormState(meeting));
    setError('');
  };

  const startCreating = () => {
    setIsCreating(true);
    setSelectedId(null);
    setForm(emptyForm);
    setError('');
  };

  const cancelPanel = () => {
    setIsCreating(false);
    setSelectedId(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.preferredDate || !form.preferredTime) {
      setError('Name, email, phone, date, and time are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isCreating) {
        const response = await fetch('/api/admin/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to book meeting');
      } else if (selectedId) {
        const response = await fetch('/api/admin/meetings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedId, ...form }),
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to update meeting');
      }

      await fetchMeetings();
      setIsCreating(false);
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const response = await fetch(`/api/admin/meetings?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMeetings(meetings.filter((m) => m.id !== id));
        if (selectedId === id) cancelPanel();
      }
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  const panelOpen = isCreating || !!selectedMeeting;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meetings</h1>
          <p className="text-gray-400">Your upcoming meetings &mdash; book new ones or edit existing bookings</p>
        </div>
        <button
          onClick={startCreating}
          className="flex items-center gap-2 bg-[#dbf72c] text-[#0c0f17] px-5 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#dbf72c]/50 transition-all duration-300"
        >
          <Plus size={18} />
          Book Meeting
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <input
          type="checkbox"
          checked={showPast}
          onChange={(e) => setShowPast(e.target.checked)}
          className="accent-[#dbf72c]"
        />
        Show past meetings
      </label>

      {loading ? (
        <div className="text-white">Loading meetings...</div>
      ) : visibleMeetings.length === 0 ? (
        <div className="bg-gray-900/50 rounded-2xl p-12 border border-gray-800 text-center">
          <Calendar className="mx-auto mb-4 text-gray-600" size={40} />
          <p className="text-gray-400">No upcoming meetings. Click &ldquo;Book Meeting&rdquo; to schedule one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-800/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">When</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {visibleMeetings.map((meeting) => (
                    <tr
                      key={meeting.id}
                      className={`hover:bg-gray-800/30 transition-colors cursor-pointer ${
                        selectedId === meeting.id ? 'bg-gray-800/50' : ''
                      }`}
                      onClick={() => selectMeeting(meeting)}
                    >
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">
                          {new Date(meeting.preferred_date).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 text-sm">{meeting.preferred_time?.slice(0, 5)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{meeting.name}</div>
                        <div className="text-gray-400 text-sm">
                          {meeting.type === 'online' ? meeting.platform || 'Online' : 'Callback'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            meeting.status === 'confirmed'
                              ? 'bg-green-400/10 text-green-400'
                              : meeting.status === 'cancelled'
                              ? 'bg-red-400/10 text-red-400'
                              : 'bg-blue-400/10 text-blue-400'
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(meeting.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            {panelOpen ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {isCreating ? 'Book a New Meeting' : 'Edit Meeting'}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Type</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      >
                        <option value="online">Online</option>
                        <option value="callback">Callback</option>
                      </select>
                    </div>
                  </div>

                  {form.type === 'online' ? (
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Platform</label>
                      <select
                        value={form.platform}
                        onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      >
                        <option value="zoom">Zoom</option>
                        <option value="whatsapp">WhatsApp Video</option>
                        <option value="teams">Microsoft Teams</option>
                        <option value="google-meet">Google Meet</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Timezone</label>
                      <input
                        type="text"
                        value={form.timezone}
                        onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                        placeholder="e.g. GMT+1"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Date</label>
                      <input
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Time</label>
                      <input
                        type="time"
                        value={form.preferredTime}
                        onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Notes</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                    />
                  </div>

                  {!isCreating && (
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#dbf72c]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-[#dbf72c] text-[#0c0f17] px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#dbf72c]/50 transition-all duration-300 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : isCreating ? 'Book Meeting' : 'Save Changes'}
                    </button>
                    <button
                      onClick={cancelPanel}
                      className="px-4 py-3 rounded-lg font-semibold text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Select a meeting to view details, or click &ldquo;Book Meeting&rdquo; to schedule a new one
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-gray-400 text-sm">
        Total meetings: {visibleMeetings.length}
      </div>
    </div>
  );
}
