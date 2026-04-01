import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { enabled: false } });

export default function TeamMembers({ onSelect, selectedId }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select('id, name, email');
      if (!error) setUsers(data || []);
    }
    fetchUsers();
  }, []);
  return (
    <>
      {users.length === 0 && <span className="text-gray-400">No users found</span>}
      {users.length > 0 && (
        <select
          className="border rounded px-2 py-1"
          value={selectedId}
          onChange={e => onSelect(Number(e.target.value))}
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name || u.email}</option>
          ))}
        </select>
      )}
    </>
  );
}
