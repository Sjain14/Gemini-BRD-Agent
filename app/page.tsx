'use client'

import React, { useState } from 'react';
import { 
  Layers, Sparkles, FolderTree, CloudUpload, Brain, Database, Settings,
  ChevronRight, Bell, Download
} from 'lucide-react';

import ProjectsTab from '@/components/ProjectsTab';
import DataSourcesTab from '@/components/DataSourcesTab';
import ModelsTab from '@/components/ModelsTab';
import AuditLogsTab from '@/components/AuditLogsTab';
import SettingsTab from '@/components/SettingsTab';
import WorkspaceTab from '@/components/WorkspaceTab';
import { useGenerateBRD } from '@/hooks/useGenerateBRD';

type TabType = 'workspace' | 'projects' | 'data-sources' | 'models' | 'audit-logs' | 'settings';

export default function NexusDashboard() {
  const [currentTab, setCurrentTab] = useState<TabType>('workspace');
  
  const generateBrdProps = useGenerateBRD();
  const { brdMarkdown, handleExport } = generateBrdProps;



  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-800 w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Layers className="text-blue-500 w-6 h-6 mr-3" />
          <span className="text-white font-bold text-lg tracking-wide">NexusBRD</span>
          <span className="ml-2 text-[10px] uppercase font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">v1.0</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
          <button onClick={() => setCurrentTab('workspace')} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === 'workspace' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Sparkles className="w-5 h-5 mr-3 shrink-0" /> Agent Workspace
          </button>
          <button onClick={() => setCurrentTab('projects')} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === 'projects' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FolderTree className="w-5 h-5 mr-3 shrink-0" /> Projects
          </button>
          <button onClick={() => setCurrentTab('data-sources')} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === 'data-sources' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <CloudUpload className="w-5 h-5 mr-3 shrink-0" /> Data Sources
          </button>
          
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 mt-8 px-2">Infrastructure</p>
          <button onClick={() => setCurrentTab('models')} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === 'models' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Brain className="w-5 h-5 mr-3 shrink-0" /> Vertex AI Models
          </button>
          <button onClick={() => setCurrentTab('audit-logs')} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === 'audit-logs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Database className="w-5 h-5 mr-3 shrink-0" /> BigQuery Audit Logs
          </button>
          <button onClick={() => setCurrentTab('settings')} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-5 h-5 mr-3 shrink-0" /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://ui-avatars.com/api/?name=Brute+Force&background=0D8ABC&color=fff" className="w-9 h-9 rounded-full ring-2 ring-slate-800" alt="Team" />
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">Team Brute Force</p>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Hack Days Delhi</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center min-w-0">
            <span className="text-sm font-medium text-gray-500 shrink-0">Project:</span>
            <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold shadow-inner truncate max-w-[200px]">Logistics Dashboard BRD</span>
            <ChevronRight className="text-gray-400 w-4 h-4 mx-3 shrink-0" />
            <span className="text-sm font-bold text-gray-800 truncate">Generation Agent Workspace</span>
          </div>
          <div className="flex items-center space-x-5 shrink-0 pl-4">
            <div className="relative">
              <Bell className="text-gray-400 hover:text-gray-600 cursor-pointer w-5 h-5 transition" />
              <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 border-2 border-white bg-red-500 w-2.5 h-2.5 rounded-full"></span>
            </div>
            <button 
              onClick={handleExport}
              disabled={!brdMarkdown}
              className={`px-4 py-2 rounded-lg text-sm flex items-center font-semibold transition shadow-sm
                ${brdMarkdown ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              <Download className="w-4 h-4 mr-2 opacity-80" /> Export BRD
            </button>
          </div>
        </header>

        {/* Content Area */}
        {currentTab === 'workspace' ? (
          <WorkspaceTab {...generateBrdProps} />
        ) : currentTab === 'projects' ? (
          <ProjectsTab />
        ) : currentTab === 'data-sources' ? (
          <DataSourcesTab />
        ) : currentTab === 'models' ? (
          <ModelsTab />
        ) : currentTab === 'audit-logs' ? (
          <AuditLogsTab />
        ) : currentTab === 'settings' ? (
          <SettingsTab />
        ) : null}
      </div>
    </div>
  );
}

