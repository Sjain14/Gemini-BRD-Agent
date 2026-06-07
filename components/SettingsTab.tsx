import React, { useState } from 'react';
import { Settings, Key, Shield, User, Bell, CheckCircle2, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function SettingsTab() {
  const { logOut } = useAuth();
  const [apiKey, setApiKey] = useState('****************************************');
  const [projectId, setProjectId] = useState('nexus-brd-ai-prod');
  const [saJson, setSaJson] = useState('gcp-service-account-prod.json');
  const [theme, setTheme] = useState('Light (Default)');

  const handleSave = () => {
    // Mock save
    alert('Settings successfully updated and cached.');
  };

  return (
    <div className="flex-1 overflow-y-auto m-6 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-slate-700" /> Platform Settings
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Configure your AI models, cloud infrastructure, and user preferences.</p>
          </div>
          <button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition shadow-sm">
            <Save className="w-5 h-5 mr-2" /> Save Changes
          </button>
        </div>

        {/* Credentials Module */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center">
             <Key className="w-5 h-5 text-blue-600 mr-3" />
             <h3 className="font-bold text-gray-800">Google Cloud Credentials</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Google Cloud Project ID</label>
              <input 
                type="text" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" 
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
                Service Account Key File
                <span className="text-emerald-600 flex items-center normal-case tracking-normal"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Authenticated</span>
              </label>
              <div className="flex">
                <input 
                  type="text" 
                  readOnly 
                  value={saJson} 
                  className="w-full bg-gray-100 border border-gray-200 rounded-l-lg px-4 py-2.5 text-sm font-medium text-gray-600 opacity-80 cursor-not-allowed" 
                />
                <button className="bg-white border border-gray-200 border-l-0 rounded-r-lg px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">Upload New</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Required for Vertex AI and BigQuery integrations.</p>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Gemini API Key Overlay</label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition font-mono" 
              />
              <p className="text-xs text-gray-500 mt-2">Will override the Default Service Account permissions strictly for GenAI calls.</p>
            </div>
          </div>
        </div>

        {/* Preferences Module */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center">
             <User className="w-5 h-5 text-purple-600 mr-3" />
             <h3 className="font-bold text-gray-800">Workspace Preferences</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Visual Theme</label>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              >
                 <option>Light (Default)</option>
                 <option>Dark (Enterprise)</option>
                 <option>System Match</option>
              </select>
            </div>
            <div>
               <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Notifications</label>
               <div className="flex items-center space-x-3 mt-3">
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Enable generative alerts</span>
               </div>
            </div>
          </div>
        </div>

        {/* Account Module */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center">
             <Shield className="w-5 h-5 text-red-600 mr-3" />
             <h3 className="font-bold text-gray-800">Account Security</h3>
          </div>
          <div className="p-6">
            <button 
              onClick={logOut}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition"
            >
              <LogOut className="w-5 h-5 mr-2" /> Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
