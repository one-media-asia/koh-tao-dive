
import { useEffect, useState } from 'react';
import TeamMembers from './TeamMembers';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [assignedUser, setAssignedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users and tasks on mount
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/admin-users');
      const data = await res.json();
      setUsers(data || []);
      if (data && data.length > 0) setAssignedUser(data[0].id);
    }
    async function fetchTasks() {
      const res = await fetch('/api/project-tasks');
      const data = await res.json();
      setTasks(data || []);
    }
    fetchUsers();
    fetchTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!newTask.trim() || !assignedUser) return;
    const res = await fetch('/api/project-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask, assigned_to: assignedUser, status: 'To Do' })
    });
    const data = await res.json();
    if (res.ok) setTasks([...tasks, data]);
    setNewTask('');
  }

  async function changeStatus(id, status) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const res = await fetch('/api/project-tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, status, assigned_to: task.assigned_to })
    });
    const data = await res.json();
    if (res.ok) setTasks(tasks.map(t => t.id === id ? data : t));
  }

  async function changeAssignee(id, userId) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const res = await fetch('/api/project-tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, assigned_to: userId })
    });
    const data = await res.json();
    if (res.ok) setTasks(tasks.map(t => t.id === id ? data : t));
  }

  async function deleteTask(id) {
    const res = await fetch('/api/project-tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div>
      <form onSubmit={addTask} className="flex space-x-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task..."
        />
        <TeamMembers onSelect={setAssignedUser} selectedId={assignedUser} />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" type="submit">Add</button>
      </form>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-t">
              <td>{task.title}</td>
              <td>
                <TeamMembers
                  onSelect={userId => changeAssignee(task.id, userId)}
                  selectedId={task.assigned_to}
                />
              </td>
              <td>
                <select
                  value={task.status}
                  onChange={e => changeStatus(task.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </td>
              <td>
                <button className="text-red-600" onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
