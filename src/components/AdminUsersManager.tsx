import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'user';

interface UserRoleRow {
  user_id: string;
  role: AppRole;
  created_at?: string;
}

const AdminUsersManager: React.FC = () => {
  const [rows, setRows] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [userIdDraft, setUserIdDraft] = useState('');
  const [roleDraft, setRoleDraft] = useState<AppRole>('user');

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data || []) as UserRoleRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const grouped = useMemo(() => {
    const m = new Map<string, AppRole[]>();
    rows.forEach((row) => {
      if (!m.has(row.user_id)) m.set(row.user_id, []);
      m.get(row.user_id)!.push(row.role);
    });
    return Array.from(m.entries()).map(([userId, roles]) => ({ userId, roles }));
  }, [rows]);

  const addRole = async () => {
    const userId = userIdDraft.trim();
    if (!userId) {
      alert('Enter a user UUID first.');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: roleDraft });

    setSaving(false);

    if (error) {
      alert('Error adding role: ' + error.message);
      return;
    }

    setUserIdDraft('');
    await fetchRoles();
  };

  const removeRole = async (userId: string, role: AppRole) => {
    const confirmed = window.confirm(`Remove ${role} role from ${userId}?`);
    if (!confirmed) return;

    setSaving(true);
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    setSaving(false);

    if (error) {
      alert('Error removing role: ' + error.message);
      return;
    }

    await fetchRoles();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Users</h2>

      <div className="rounded border border-gray-200 p-3">
        <div className="mb-2 text-sm font-semibold">Add User Role</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <input
            value={userIdDraft}
            onChange={(e) => setUserIdDraft(e.target.value)}
            placeholder="Supabase user UUID"
            className="rounded border border-gray-300 px-3 py-2 md:col-span-2"
          />
          <select
            value={roleDraft}
            onChange={(e) => setRoleDraft(e.target.value as AppRole)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="button"
            onClick={addRole}
            disabled={saving}
            className="rounded bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Role'}
          </button>
        </div>
      </div>

      {loading ? <div>Loading users...</div> : null}
      {error ? <div className="text-red-600">Error: {error}</div> : null}

      {!loading && !error && (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 text-left">User ID</th>
                <th className="border border-gray-200 p-2 text-left">Roles</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((row) => (
                <tr key={row.userId}>
                  <td className="border border-gray-200 p-2 text-xs md:text-sm">{row.userId}</td>
                  <td className="border border-gray-200 p-2">
                    <div className="flex flex-wrap gap-2">
                      {row.roles.map((role) => (
                        <span
                          key={`${row.userId}-${role}`}
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${role === 'admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}
                        >
                          {role}
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => removeRole(row.userId, role)}
                            title="Remove role"
                          >
                            remove
                          </button>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {grouped.length === 0 && (
                <tr>
                  <td className="p-3 text-sm text-gray-500" colSpan={2}>
                    No user roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManager;
