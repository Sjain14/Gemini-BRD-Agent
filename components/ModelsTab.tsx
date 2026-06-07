import React, { useState } from 'react';
import { Brain, Cpu, Zap, Star, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ModelsTab() {
  const [activeModel, setActiveModel] = useState('gemini-3.1-pro');

  const models = [
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro (Multimodal)', provider: 'Google Vertex AI', type: 'Production', tier: 'Premium', description: 'Advanced reasoning, multi-modal ingestion (audio/video/image), and massive context window. Optimal for BRD generation.' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google Vertex AI', type: 'Fast', tier: 'Standard', description: 'High-speed reasoning for lower-complexity tasks. Great for quick summaries.' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', type: 'External', tier: 'Premium', description: 'Strong analytical model connected via API. Requires separate configuration.' },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col m-6">
      <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-purple-500" /> Vertex AI Models
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Select the core intelligence model powering the nexus-brd agent.</p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
           <div className="flex items-center">
             <ShieldCheck className="w-5 h-5 text-emerald-600 mr-3" />
             <div>
               <p className="text-[14px] font-bold text-emerald-800">Enterprise Data Controls Enabled</p>
               <p className="text-[12px] font-medium text-emerald-600 mt-0.5">Your data is not used to train Google models.</p>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {models.map((model) => {
            const isActive = activeModel === model.id;
            return (
              <div 
                key={model.id} 
                onClick={() => setActiveModel(model.id)}
                className={`flex justify-between p-6 rounded-xl border-2 transition cursor-pointer relative overflow-hidden
                  ${isActive ? 'border-purple-500 bg-purple-50/30' : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'}`}
              >
                {isActive && <div className="absolute top-0 right-0 border-b-[40px] border-l-[40px] border-b-transparent border-l-purple-500 transform rotate-90 translate-x-[20px] -translate-y-[20px]"></div>}
                {isActive && <Star className="absolute top-2 right-2 w-4 h-4 text-white z-10" fill="currentColor" />}
                
                <div className="flex space-x-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border 
                    ${isActive ? 'bg-purple-100 border-purple-200 text-purple-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className={`text-[16px] font-bold ${isActive ? 'text-purple-900' : 'text-gray-800'}`}>{model.name}</h3>
                      <span className="ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-2 max-w-lg leading-relaxed">{model.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-center space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${model.type === 'Production' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {model.type}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1" /> {model.tier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
