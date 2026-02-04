import React, { useState } from 'react';
import { Workflow } from '../../types/workflow';

interface Props {
  workflow: Workflow;
}

// Mock data for corporate actions
const mockAnnouncements = [
  { id: 'CA-2026-001', type: 'Dividend', security: 'AAPL', exDate: '2026-02-15', recordDate: '2026-02-14', payDate: '2026-02-20', rate: '$0.24/share', status: 'active' },
  { id: 'CA-2026-002', type: 'Stock Split', security: 'TSLA', exDate: '2026-02-18', recordDate: '2026-02-17', payDate: '2026-02-25', rate: '3:1', status: 'pending' },
  { id: 'CA-2026-003', type: 'Merger', security: 'XYZ Corp', exDate: '2026-03-01', recordDate: '2026-02-28', payDate: '2026-03-15', rate: '1.5 shares', status: 'new' },
  { id: 'CA-2026-004', type: 'Rights Issue', security: 'MSFT', exDate: '2026-02-20', recordDate: '2026-02-19', payDate: '2026-03-05', rate: '1:10 @ $280', status: 'active' },
];

const mockClients = [
  { id: 'CLI-001', name: 'Pension Fund Alpha', holdings: '$45.2M', positions: 127, elections: 'Pending', deadline: '2026-02-12' },
  { id: 'CLI-002', name: 'Hedge Fund Beta', holdings: '$128.5M', positions: 342, elections: 'Submitted', deadline: '2026-02-12' },
  { id: 'CLI-003', name: 'Index Fund Gamma', holdings: '$89.1M', positions: 256, elections: 'Overdue', deadline: '2026-02-10' },
  { id: 'CLI-004', name: 'Growth Fund Delta', holdings: '$67.3M', positions: 189, elections: 'Pending', deadline: '2026-02-14' },
];

const mockDocuments = [
  { id: 'DOC-001', source: 'DTCC', type: 'ISO 15022', received: '10:23 AM', status: 'extracted', confidence: 98 },
  { id: 'DOC-002', source: 'Bloomberg', type: 'PDF Notice', received: '10:45 AM', status: 'processing', confidence: 0 },
  { id: 'DOC-003', source: 'Issuer Email', type: 'Email', received: '11:02 AM', status: 'new', confidence: 0 },
];

export function CorporateActionsTemplate({ workflow }: Props) {
  const [activeTab, setActiveTab] = useState<'announcements' | 'elections' | 'documents'>('announcements');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null);

  return (
    <div className="p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Active Events</span>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-xs text-green-600 mt-1">+3 today</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Elections Due</span>
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-amber-600 mt-1">3 overdue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Total Value</span>
            <div className="p-1.5 bg-green-100 rounded-lg">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$2.4B</p>
          <p className="text-xs text-gray-500 mt-1">Affected holdings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">STP Rate</span>
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">94%</p>
          <p className="text-xs text-green-600 mt-1">↑ 2% this week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Pending Tasks</span>
            <div className="p-1.5 bg-red-100 rounded-lg">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-red-600 mt-1">5 high priority</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'announcements'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Announcements
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'elections'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🗳️ Client Elections
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📄 Document Queue
            </button>
          </div>
        </div>

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div>
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search announcements..."
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>All Types</option>
                  <option>Dividend</option>
                  <option>Stock Split</option>
                  <option>Merger</option>
                  <option>Rights Issue</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                + Add Manual Entry
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Event ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Security</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ex-Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pay Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate/Terms</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{ann.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ann.type === 'Dividend' ? 'bg-green-100 text-green-800' :
                        ann.type === 'Stock Split' ? 'bg-purple-100 text-purple-800' :
                        ann.type === 'Merger' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ann.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{ann.security}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ann.exDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ann.payDate}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ann.rate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ann.status === 'active' ? 'bg-green-100 text-green-800' :
                        ann.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ann.status.charAt(0).toUpperCase() + ann.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedAnnouncement(ann)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Elections Tab */}
        {activeTab === 'elections' && (
          <div>
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Filter:</span>
                <button className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-800 rounded-lg">
                  Overdue (3)
                </button>
                <button className="px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 rounded-lg">
                  Pending (5)
                </button>
                <button className="px-3 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-lg">
                  Submitted (12)
                </button>
              </div>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
                📧 Send Reminders
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Holdings Value</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Positions</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Election Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{client.holdings}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.positions}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        client.elections === 'Submitted' ? 'bg-green-100 text-green-800' :
                        client.elections === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {client.elections}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${client.elections === 'Overdue' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        {client.deadline}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                      <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">Remind</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">Showing documents from the last 24 hours</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                🔄 Refresh Queue
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="p-5 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        doc.type === 'ISO 15022' ? 'bg-green-100' :
                        doc.type === 'PDF Notice' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <svg className={`w-6 h-6 ${
                          doc.type === 'ISO 15022' ? 'text-green-600' :
                          doc.type === 'PDF Notice' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            doc.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            doc.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {doc.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">Received {doc.received}</span>
                        </div>
                        <p className="font-semibold text-gray-900">{doc.source}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {doc.status === 'extracted' && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">AI Confidence</p>
                          <p className="text-lg font-bold text-green-600">{doc.confidence}%</p>
                        </div>
                      )}
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        doc.status === 'new' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                        doc.status === 'processing' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
                        'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {doc.status === 'new' ? 'Process' : doc.status === 'processing' ? 'Processing...' : 'Review'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedAnnouncement.type === 'Dividend' ? 'bg-green-100 text-green-800' :
                    selectedAnnouncement.type === 'Stock Split' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedAnnouncement.type}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedAnnouncement.security}</h2>
                  <p className="text-sm text-gray-500">{selectedAnnouncement.id}</p>
                </div>
                <button onClick={() => setSelectedAnnouncement(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Ex-Date</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAnnouncement.exDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Record Date</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAnnouncement.recordDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Pay Date</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAnnouncement.payDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Rate/Terms</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAnnouncement.rate}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Affected Clients</h3>
                <p className="text-sm text-gray-600">12 clients with total holdings of $145M affected by this event.</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setSelectedAnnouncement(null)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Process Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
