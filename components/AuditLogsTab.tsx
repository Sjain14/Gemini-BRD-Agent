import React from 'react';
import { Database, TableProperties, Calendar, Clock, ExternalLink, Download } from 'lucide-react';

export default function AuditLogsTab() {
  const logs = [
    { id: 'LOG-8849', session: 'sess_1x9a', project: 'Logistics Dashboard BRD', inputs: 4, generatedAt: '2026-06-05 10:24 AM', status: 'Persisted' },
    { id: 'LOG-8848', session: 'sess_1x98', project: 'Mobile Fleet Tracker UI', inputs: 1, generatedAt: '2026-06-04 15:42 PM', status: 'Persisted' },
    { id: 'LOG-8847', session: 'sess_1x97', project: 'Mobile Fleet Tracker UI', inputs: 2, generatedAt: '2026-06-04 14:10 PM', status: 'Persisted' },
    { id: 'LOG-8846', session: 'sess_1x90', project: 'Payment Gateway Integration', inputs: 0, generatedAt: '2026-06-02 09:12 AM', status: 'Failed' },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col m-6">
      <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Database className="w-6 h-6 mr-3 text-emerald-500" /> BigQuery Audit Logs
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Enterprise traceability. Every BRD generated is logged to prevent hallucination liabilities.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition shadow-sm">
          <Download className="w-5 h-5 mr-2" /> Export CSV
        </button>
      </div>

      <div className="p-0 flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="p-4 pl-6">Log ID</th>
              <th className="p-4">Session Token</th>
              <th className="p-4">Project</th>
              <th className="p-4">Input URIs</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Sync Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 pl-6">
                  <div className="text-sm font-bold text-emerald-700 flex items-center">
                    <TableProperties className="w-4 h-4 mr-2" />
                    {log.id}
                  </div>
                </td>
                <td className="p-4 text-sm font-mono text-gray-500">{log.session}</td>
                <td className="p-4 text-sm font-bold text-gray-800">{log.project}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                    {log.inputs} files mapped
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {log.generatedAt}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    log.status === 'Persisted' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center">
                     Inspect <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
