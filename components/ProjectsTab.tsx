import React from 'react';
import { FolderTree, Plus, MoreVertical, Layout, Box, Globe, ChevronRight } from 'lucide-react';

export default function ProjectsTab() {
  const projects = [
    { id: '1', name: 'Logistics Dashboard BRD', category: 'Web App', status: 'Active', updated: '2 hrs ago', icon: <Globe className="w-5 h-5 text-blue-500" /> },
    { id: '2', name: 'Mobile Fleet Tracker UI', category: 'Mobile App', status: 'Draft', updated: '1 day ago', icon: <Layout className="w-5 h-5 text-purple-500" /> },
    { id: '3', name: 'Payment Gateway Integration', category: 'Backend Api', status: 'Completed', updated: '3 days ago', icon: <Box className="w-5 h-5 text-emerald-500" /> },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col m-6">
      <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <FolderTree className="w-6 h-6 mr-3 text-blue-500" /> Projects Management
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Organize and manage your BRD generation projects across teams.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> New Project
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition bg-white group cursor-pointer">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {proj.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-800 group-hover:text-blue-600 transition">{proj.name}</h3>
                  <div className="flex items-center mt-1 space-x-3 text-sm font-medium text-gray-500">
                    <span>{proj.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>Updated {proj.updated}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  proj.status === 'Active' ? 'bg-blue-50 text-blue-600' :
                  proj.status === 'Draft' ? 'bg-orange-50 text-orange-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {proj.status}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
