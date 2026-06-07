import React from 'react';
import { CloudUpload, Database, HardDrive, FileText, ChevronRight, RefreshCw, Upload, CheckCircle2 } from 'lucide-react';

export default function DataSourcesTab() {
  const sources = [
    { id: '1', name: 'nexus-brd-uploads', type: 'Google Cloud Storage', sync: 'Live', size: '2.4 GB', items: '142 files', icon: <CloudUpload className="w-5 h-5 text-blue-500" /> },
    { id: '2', name: 'Legacy Document Lake', type: 'Amazon S3', sync: 'Scheduled', size: '14.1 GB', items: '1,204 files', icon: <HardDrive className="w-5 h-5 text-orange-500" /> },
    { id: '3', name: 'Client CRM Data', type: 'BigQuery Extract', sync: 'Paused', size: '412 MB', items: '1 table', icon: <Database className="w-5 h-5 text-purple-500" /> },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col m-6">
      <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <CloudUpload className="w-6 h-6 mr-3 text-blue-500" /> Data Sources & Integrations
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage connected buckets, databases, and local uploads for Multimodal ingestion.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition shadow-sm">
          <Upload className="w-5 h-5 mr-2" /> Connect Source
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">Connected Storage</h3>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {sources.map((src) => (
            <div key={src.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition bg-white group">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {src.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-800">{src.name}</h3>
                  <div className="flex items-center mt-1 space-x-3 text-sm font-medium text-gray-500">
                    <span>{src.type}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{src.items}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{src.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-sm font-semibold text-gray-600">
                  {src.sync === 'Live' ? <RefreshCw className="w-4 h-4 text-emerald-500 mr-2 animate-spin-slow" /> : 
                   src.sync === 'Scheduled' ? <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" /> : 
                   <div className="w-2 h-2 rounded-full bg-orange-400 mr-3"></div>}
                  {src.sync}
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold opacity-0 group-hover:opacity-100 transition">Manage</button>
              </div>
            </div>
          ))}
        </div>
        
        <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Uploads</h3>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
             <FileText className="w-12 h-12 text-gray-300 mb-3" />
             <p className="text-sm font-bold text-gray-600">No local uploads this session.</p>
             <p className="text-xs font-medium text-gray-400 mt-1 max-w-sm">Files dragged into the Agent Workspace will appear here temporarily before syncing to Google Cloud Storage.</p>
        </div>
      </div>
    </div>
  );
}
