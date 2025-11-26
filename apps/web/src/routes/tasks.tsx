import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/convex-client/api';
import { useState } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import type { Id } from '@repo/convex-client/dataModel';

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
});

function TasksPage() {
  const tasks = useQuery(api.tasks.listTasks);
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title: title.trim(),
      description: description.trim() || undefined,
    });
    setTitle('');
    setDescription('');
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateTask({
      id: id as Id<'tasks'>,
      completed: !completed,
    });
  };

  const startEdit = (task: {
    _id: string;
    title: string;
    description?: string;
  }) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    await updateTask({
      id: id as Id<'tasks'>,
      title: editTitle.trim(),
      description: editDescription.trim() || null,
    });
    cancelEdit();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ id: id as Id<'tasks'> });
    }
  };

  if (tasks === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Tasks</h1>
          <div className="text-gray-400">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Tasks</h1>

        {/* Create Task Form */}
        <form
          onSubmit={handleCreate}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Create New Task
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder="Enter task description (optional)"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-4">
            All Tasks ({tasks.length})
          </h2>
          {tasks.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center text-gray-400">
              No tasks yet. Create your first task above!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
              >
                {editingId === task._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(task._id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Check size={16} />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        handleToggleComplete(task._id, task.completed)
                      }
                      className="mt-1 w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          task.completed
                            ? 'text-gray-500 line-through'
                            : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-gray-400 mb-2 ${
                            task.completed ? 'line-through' : ''
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Created: {new Date(task._creationTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-2 text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Edit task"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
