import React, { useRef, useState } from 'react';
import { 
  CloudUpload, Cpu, CheckCircle2, FilePlus, Loader2, FileAudio, 
  Image as ImageIcon, FileText, Check, Database, FileEdit, Code, Eye, Shield, Sparkles, ChevronRight
} from 'lucide-react';
import Markdown from 'react-markdown';
import { UploadedFile, BrdVersion } from '@/hooks/useGenerateBRD';

interface WorkspaceTabProps {
  files: UploadedFile[];
  versions: BrdVersion[];
  selectedVersionId: string | null;
  setSelectedVersionId: (id: string) => void;
  brdMarkdown: string;
  setBrdMarkdown: (md: string) => void;
  isGenerating: boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  handleFilesSelected: (files: File[]) => Promise<void>;
  chatMessages: { role: 'user' | 'model'; content: string }[];
  isChatting: boolean;
  sendChatMessage: (msg: string) => Promise<void>;
}

export default function WorkspaceTab({
  files,
  versions,
  selectedVersionId,
  setSelectedVersionId,
  brdMarkdown,
  setBrdMarkdown,
  isGenerating,
  errorMsg,
  setErrorMsg,
  handleFilesSelected,
  chatMessages,
  isChatting,
  sendChatMessage,
}: WorkspaceTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <main className="flex-1 overflow-x-auto overflow-y-auto bg-slate-50/50 p-6 flex gap-6 min-w-max">
      
      {/* Left Column: Ingestion */}
      <div className="w-[380px] flex flex-col gap-6 shrink-0">
        {/* Dropzone */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-[15px] flex items-center font-bold text-gray-800 mb-4">
            <CloudUpload className="text-blue-500 w-5 h-5 mr-2.5" /> Multi-Modal Ingestion
          </h2>
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/80'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileInputChange} 
              className="hidden" 
              multiple 
              accept="audio/*,image/*,.pdf,.txt"
            />
            <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-blue-100">
              <FilePlus className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-[14px] font-semibold text-gray-700">Drag & drop raw inputs here</p>
            <p className="text-[12px] text-gray-500 mt-1.5 font-medium">Supports Audio, Images, PDFs, and Text</p>
          </div>
        </div>

        {/* Processed Files */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[15px] flex items-center font-bold text-gray-800">
              <Cpu className="text-purple-500 w-5 h-5 mr-2.5" /> Vertex AI Processing
            </h2>
            <span className="text-[11px] flex items-center font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> System Optimal
            </span>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {files.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                No files currently queued for processing.
              </div>
            ) : (
              files.map((file) => {
                const isAudio = file.type.includes('audio');
                const isImage = file.type.includes('image');
                const isDone = file.status === 'done';
                const isProcessing = file.status === 'processing';
                
                return (
                  <div key={file.id} className={`flex items-center p-3.5 border bg-white rounded-xl shadow-sm transition-all
                    ${isImage ? 'border-l-4 border-l-blue-500 border-gray-100' : 'border-gray-100'} 
                    ${isProcessing ? 'ring-1 ring-blue-100' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3.5 shrink-0
                      ${isAudio ? 'bg-orange-50 text-orange-400' : 
                        isImage ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                      {isAudio ? <FileAudio className="w-5 h-5" /> : 
                       isImage ? <ImageIcon className="w-5 h-5" /> : 
                       <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-bold text-gray-800 truncate mb-0.5">{file.name}</p>
                      <div className="text-[11px] font-medium flex items-center">
                        {isProcessing ? (
                          <span className="text-blue-600 flex items-center">
                            <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                            Gemini Vision Analyzing...
                          </span>
                        ) : isDone ? (
                          <span className="text-gray-500">
                            {isAudio ? 'Transcribed • Features Extracted' : 
                             isImage ? 'Parsed • Vision Analysis Complete' : 
                             'Parsed • Vectorized'}
                          </span>
                        ) : (
                          <span className="text-gray-400">Uploading...</span>
                        )}
                      </div>
                    </div>
                    {isDone && (
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 ml-3">
                        <Check className="text-emerald-500 w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Explainability Sync */}
          <div className="mt-5 pt-5 border-t border-gray-100 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] flex items-center font-bold text-gray-600">
                <Database className="text-blue-400 w-3.5 h-3.5 mr-1.5" /> BigQuery Sync
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {files.some(f => f.status === 'done') ? 'Synced just now' : 'Awaiting data'}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: files.some(f => f.status === 'done') ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: BRD Preview */}
      <div className="flex-1 min-w-[500px] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50/80 rounded-t-xl shrink-0">
          <div className="flex items-center">
            <h2 className="text-[15px] flex items-center font-bold text-gray-800 mr-4">
              <FileEdit className="text-emerald-500 w-5 h-5 mr-2.5" /> Generated BRD Preview
            </h2>
            {versions.length > 0 && (
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-sm">
                <span className="text-[11px] font-bold text-gray-400 flex items-center mr-2">
                  VERSION
                </span>
                <select 
                  value={selectedVersionId || ''} 
                  onChange={(e) => {
                    setSelectedVersionId(e.target.value);
                    const v = versions.find(v => v.id === e.target.value);
                    if (v) setBrdMarkdown(v.markdown);
                  }}
                  className="text-[13px] font-bold text-blue-600 bg-transparent border-none outline-none cursor-pointer focus:ring-0 appearance-none pr-2"
                >
                  {versions.map(v => (
                    <option key={v.id} value={v.id}>
                      v{v.version}.0 - {v.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex space-x-1.5">
            <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition"><Code className="w-4 h-4" /></button>
            <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition"><Eye className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="p-8 flex-1 overflow-y-auto bg-white relative">
          {errorMsg && (
            <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl shadow-sm text-sm font-medium z-10 flex justify-between items-start">
              <div>
                <strong className="block font-bold mb-1">Processing Failed</strong>
                {errorMsg}
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}
          {!brdMarkdown && isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-full border border-gray-100 shadow-sm">
                  <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[15px] font-bold text-gray-800">Synthesizing Requirements</p>
                <p className="text-[13px] font-medium text-gray-500 mt-1">Cross-referencing multimodal inputs via Gemini...</p>
              </div>
            </div>
          ) : brdMarkdown ? (
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none 
              prose-headings:font-bold prose-h1:text-2xl prose-h1:border-b prose-h1:pb-4 prose-h1:mb-6
              prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-lg prose-h2:text-slate-800
              prose-p:text-[14px] prose-p:leading-relaxed prose-p:text-slate-600
              prose-li:text-[14px] prose-li:text-slate-600
              prose-strong:text-slate-800">
              <Markdown components={{
                ul: ({node, ...props}) => <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 mb-5"><ul className="list-disc pl-5 space-y-3 m-0" {...props} /></div>,
                li: ({node, ...props}) => {
                  const children = React.Children.toArray(props.children);
                  return (
                    <li className="marker:text-slate-400 pl-1">{children}</li>
                  );
                },
                strong: ({node, ...props}) => {
                  const text = String(props.children);
                  if (text.match(/^[N]?FR-\d+/)) {
                    return <span className="font-bold text-blue-700">{props.children}</span>;
                  }
                  return <strong {...props} />;
                },
                p: ({node, ...props}) => {
                   return <p {...props} />;
                }
              }}>{brdMarkdown}</Markdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-800">Awaiting Ingestion</h3>
              <p className="text-[13.5px] font-medium text-gray-500 mt-2 max-w-sm text-center leading-relaxed">
                Upload client meeting audio, UI whiteboard sketches, or product notes to automatically synthesize an Enterprise BRD.
              </p>
              
              {files.length === 0 && (
                <div className="mt-10 opacity-40 pointer-events-none w-full max-w-lg grayscale border border-dashed border-gray-200 rounded-xl p-6">
                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                   <div className="h-3 bg-gray-100 rounded w-1/4 mb-6"></div>
                   <div className="space-y-3">
                     <div className="h-3 bg-gray-100 rounded w-full"></div>
                     <div className="h-3 bg-gray-100 rounded w-full"></div>
                     <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 border-t border-gray-200 p-3.5 text-center text-[11.5px] font-medium flex items-center justify-center text-gray-500 rounded-b-xl shrink-0">
          <Shield className="w-3.5 h-3.5 mr-1.5" /> AI-generated content. All traces securely logged in BigQuery for compliance auditing.
        </div>
      </div>

      {/* Far Right Column: Chat Discussion (Only shown when BRD is generated) */}
      {brdMarkdown && (
        <div className="w-[350px] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-w-0 shrink-0">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50/80 rounded-t-xl shrink-0">
            <h2 className="text-[14px] flex items-center font-bold text-gray-800">
              <Sparkles className="text-blue-500 w-4 h-4 mr-2" /> Discuss BRD
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {chatMessages.length === 0 ? (
              <div className="text-center text-sm text-gray-400 mt-10">
                Ask questions or discuss the generated BRD above.
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm
                    ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'}`}
                  >
                    <Markdown>{msg.content || (isChatting && idx === chatMessages.length - 1 ? 'Typing...' : '')}</Markdown>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim() && !isChatting) {
                  sendChatMessage(chatInput);
                  setChatInput('');
                }
              }}
              className="flex items-center bg-gray-50 border border-gray-200 rounded-lg pr-1 pl-3 py-1 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about the BRD..."
                disabled={isChatting}
                className="flex-1 bg-transparent border-none outline-none text-[13px] py-1.5 text-gray-800"
              />
              <button 
                type="submit" 
                disabled={isChatting || !chatInput.trim()}
                className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition"
              >
                {isChatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
