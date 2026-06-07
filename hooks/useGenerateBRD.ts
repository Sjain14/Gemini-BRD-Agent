import { useState } from 'react';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'done' | 'error';
}

export interface BrdVersion {
  id: string;
  version: number;
  timestamp: Date;
  markdown: string;
  files: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const sampleMarkdown = `# 1. Executive Summary
The NexusBRD Logistics Dashboard aims to streamline fleet management by integrating real-time GPS tracking and automated delivery scheduling into a single pane of glass. [Source: dashboard_wireframe.png]

# 2. Business Problem / Needs Statement
Current routing requires manual dispatching, which introduces a 15% latency in delivery timelines. [Source: client_meeting_audio.mp3]

# 3. Project Objectives (SMART Goals)
* Reduce dispatch latency by 15% by Q3. [Source: client_meeting_audio.mp3]

# 4. Project Scope
**In-Scope:** Live map view, automated push notifications to drivers. [Source: client_meeting_audio.mp3]
**Out-of-Scope:** Payroll integration for drivers. [Unverified Assumption]

# 5. Stakeholder Analysis
| Stakeholder | Role | Expectations |
|---|---|---|
| Dispatch Team | Primary Users | Real-time visibility into truck locations |
| Drivers | End Users | Easy-to-read push notifications |

# 6. High-Level Business Requirements
* **BR-01**: The system must provide real-time location data. [Source: dashboard_wireframe.png]

# 7. Functional & Non-Functional Requirements
* **FR-01**: The system must display a live map of all active delivery trucks. [Source: dashboard_wireframe.png]
* **NFR-01**: The map must load within 2 seconds on a 4G connection. [Unverified Assumption]

# 8. Assumptions & Constraints
* **Assumption**: Drivers have smartphones capable of receiving push notifications. [Unverified Assumption]

# 9. Cost-Benefit Considerations
Insufficient data provided in source files.

# 10. Success Metrics / KPIs
* 99.9% uptime for the GPS tracking API. [Source: client_meeting_audio.mp3]`;

const sampleFiles: UploadedFile[] = [
  {
    id: 'sample-file-1',
    file: new File([""], "client_meeting_audio.mp3", { type: "audio/mp3" }),
    name: 'client_meeting_audio.mp3',
    type: 'audio/mp3',
    progress: 100,
    status: 'done'
  },
  {
    id: 'sample-file-2',
    file: new File([""], "dashboard_wireframe.png", { type: "image/png" }),
    name: 'dashboard_wireframe.png',
    type: 'image/png',
    progress: 100,
    status: 'done'
  }
];

const sampleVersion: BrdVersion = {
  id: 'sample-version-1',
  version: 1,
  timestamp: new Date(),
  markdown: sampleMarkdown,
  files: ['client_meeting_audio.mp3', 'dashboard_wireframe.png']
};

export function useGenerateBRD() {
  const isDev = process.env.NODE_ENV === 'development';
  const [files, setFiles] = useState<UploadedFile[]>(isDev ? sampleFiles : []);
  const [versions, setVersions] = useState<BrdVersion[]>(isDev ? [sampleVersion] : []);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(isDev ? 'sample-version-1' : null);
  const [brdMarkdown, setBrdMarkdown] = useState<string>(isDev ? sampleMarkdown : '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  const handleFilesSelected = async (newFiles: File[]) => {
    const fileRecords: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...fileRecords]);
    
    // Simulate processing state before finishing completely when BRD generates
    fileRecords.forEach(record => {
      setTimeout(() => {
        setFiles(current => current.map(f => 
          f.id === record.id ? { ...f, status: 'processing', progress: 100 } : f
        ));
      }, 500);
    });

    await handleGenerateBrd([...files.map(f => f.file), ...newFiles]);
  };

  const handleGenerateBrd = async (allFiles: File[]) => {
    if (allFiles.length === 0) return;
    
    setIsGenerating(true);
    setBrdMarkdown('');
    setErrorMsg(null);

    try {
      const formData = new FormData();
      allFiles.forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch('/api/generate-brd', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      if (!res.body) throw new Error("ReadableStream not yet supported in this browser.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullMarkdown = '';

      // Initialize the new version in state early so the user sees it selected
      const newVersionId = Math.random().toString(36).substring(7);
      const newVersionNum = versions.length + 1;
      
      setVersions(prev => [
        {
          id: newVersionId,
          version: newVersionNum,
          timestamp: new Date(),
          markdown: '',
          files: allFiles.map(f => f.name)
        },
        ...prev
      ]);
      setSelectedVersionId(newVersionId);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        if (chunkValue) {
          fullMarkdown += chunkValue;
          setBrdMarkdown(fullMarkdown);
          
          // Update the version in state progressively
          setVersions(prev => prev.map(v => 
            v.id === newVersionId ? { ...v, markdown: fullMarkdown } : v
          ));
        }
      }

      setFiles(current => current.map(f => ({ ...f, status: 'done' })));
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'An error occurred during generation.');
      setFiles(current => current.map(f => ({ ...f, status: 'error' })));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!brdMarkdown) return;
    const blob = new Blob([brdMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Find the version number or default to 1
    const versionObj = versions.find(v => v.id === selectedVersionId);
    const versionNum = versionObj ? versionObj.version : 1;
    
    a.download = `NexusBRD_v${versionNum}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadVersion = (versionId: string) => {
    const v = versions.find(v => v.id === versionId);
    if (v) {
      setBrdMarkdown(v.markdown);
      setSelectedVersionId(versionId);
    }
  };

  const sendChatMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: 'user', content: message }
    ];
    setChatMessages(newMessages);
    setIsChatting(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, brdContext: brdMarkdown })
      });

      if (!res.ok || !res.body) throw new Error("Failed to send message");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiResponse = '';

      // Add a placeholder for the model's streaming response
      setChatMessages(prev => [...prev, { role: 'model', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        if (chunkValue) {
          aiResponse += chunkValue;
          setChatMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = aiResponse;
            return updated;
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with AI Assistant.');
    } finally {
      setIsChatting(false);
    }
  };

  return {
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
    handleExport,
    chatMessages,
    isChatting,
    loadVersion,
    sendChatMessage
  };
}
