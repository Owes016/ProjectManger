'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  due_date: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  github_url: string | null;
  deployment_url: string | null;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProject();
      fetchTasks();
    }
  }, [user, id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return;
      }

      setProject(data);
      setEditedProject(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          status: editedProject.status,
          github_url: editedProject.github_url,
          deployment_url: editedProject.deployment_url
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating project:', error);
        setError(error.message);
        return;
      }

      setProject({
        ...project!,
        ...editedProject
      });
      setIsEditing(false);
      setError('');
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while updating the project');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description || null,
          project_id: id,
          is_completed: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        setError(error.message);
        return;
      }

      setTasks([data, ...tasks]);
      setNewTask({ title: '', description: '' });
      setError('');
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while adding the task');
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          is_completed: !currentStatus
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      setTasks(
        tasks.map(task => 
          task.id === taskId ? { ...task, is_completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        setError(error.message);
        return;
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while deleting the project');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Project not found</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">ProjectPilot</h1>
            <Link 
              href="/dashboard" 
              className="text-gray-300 hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            {isEditing ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit Project</h2>
                  <div className="space-x-2">
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProject(project);
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleEditProject}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                      Project Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={editedProject.title || ''}
                      onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={editedProject.description || ''}
                      onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                      Status
                    </label>
                    <select
                      id="status"
                      value={editedProject.status || 'planning'}
                      onChange={(e) => setEditedProject({...editedProject, status: e.target.value})}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      value={editedProject.github_url || ''}
                      onChange={(e) => setEditedProject({...editedProject, github_url: e.target.value})}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deploymentUrl" className="block text-sm font-medium text-gray-300">
                      Deployment URL
                    </label>
                    <input
                      type="url"
                      id="deploymentUrl"
                      value={editedProject.deployment_url || ''}
                      onChange={(e) => setEditedProject({...editedProject, deployment_url: e.target.value})}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                    <span className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'planning' ? 'bg-blue-500' :
                      project.status === 'in-progress' ? 'bg-yellow-500' :
                      project.status === 'completed' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={handleDeleteProject}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-white">{project.description || 'No description provided'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">GitHub Repository</h3>
                    {project.github_url ? (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        {project.github_url}
                      </a>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Deployment</h3>
                    {project.deployment_url ? (
                      <a 
                        href={project.deployment_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        {project.deployment_url}
                      </a>
                    ) : (
                      <p className="text-gray-500">Not deployed yet</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>Created: {new Date(project.created_at).toLocaleString()}</div>
                  <div>Last updated: {new Date(project.updated_at).toLocaleString()}</div>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">Tasks</h2>
            
            <form onSubmit={handleAddTask} className="mb-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-300">
                    New Task
                  </label>
                  <input
                    type="text"
                    id="taskTitle"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Task title"
                  />
                </div>
                
                <div>
                  <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-300">
                    Description (optional)
                  </label>
                  <textarea
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={2}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Task description"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>
            
            {tasks.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No tasks yet. Add your first task above.
              </div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className="bg-gray-750 rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={() => handleToggleTask(task.id, task.is_completed)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded mt-1"
                        />
                        <div className="ml-3">
                          <p className={`text-white font-medium ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                          {task.due_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 