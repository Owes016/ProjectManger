'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  github_url: string | null;
  deployment_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, filter]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'on-hold':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">ProjectPilot</h1>
            <div className="flex items-center space-x-4">
              <Link 
                href="/project/new" 
                className="px-4 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                New Project
              </Link>
              <button 
                onClick={() => signOut()} 
                className="text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">My Projects</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('planning')} 
                className={`px-3 py-1 rounded text-sm ${filter === 'planning' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Planning
              </button>
              <button 
                onClick={() => setFilter('in-progress')} 
                className={`px-3 py-1 rounded text-sm ${filter === 'in-progress' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                In Progress
              </button>
              <button 
                onClick={() => setFilter('completed')} 
                className={`px-3 py-1 rounded text-sm ${filter === 'completed' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setFilter('on-hold')} 
                className={`px-3 py-1 rounded text-sm ${filter === 'on-hold' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                On Hold
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-400 my-12">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-xl text-gray-300 mb-4">No projects found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? "You haven't created any projects yet." 
                  : `You don't have any ${filter} projects.`}
              </p>
              <Link 
                href="/project/new" 
                className="px-4 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                Create New Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`} className="block">
                  <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:bg-gray-750 hover:shadow-lg transition-all">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {project.description || 'No description provided'}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Updated {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                        <span className="text-indigo-400 text-sm hover:text-indigo-300">View details →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
} 