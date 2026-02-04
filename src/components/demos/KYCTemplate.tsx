import React, { useState } from 'react';
import { Workflow } from '../../types/workflow';

interface Props {
  workflow: Workflow;
}

const mockCustomers = [
  { id: 'CUS-001', name: 'John Mitchell', type: 'Individual', risk: 'Low', status: 'verified', country: 'USA', submitted: '2026-02-01' },
  { id: 'CUS-002', name: 'Acme Holdings Ltd', type: 'Corporate', risk: 'Medium', status: 'pending_review', country: 'UK', submitted: '2026-02-02' },
  { id: 'CUS-003', name: 'Sarah Chen', type: 'Individual', risk: 'High', status: 'flagged', country: 'Singapore', submitted: '2026-02-03' },
  { id: 'CUS-004', name: 'Global Ventures Inc', type: 'Corporate', risk: 'Low', status: 'pending_docs', country: 'Germany', submitted: '2026-02-03' },
  { id: 'CUS-005', name: 'Mohammed Al-Rashid', type: 'Individual', risk: 'Medium', status: 'in_progress', country: 'UAE', submitted: '2026-02-04' },
];

const mockAlerts = [
  { id: 'ALT-001', type: 'PEP Match', customer: 'Sarah Chen', severity: 'high', details: 'Potential match with politically exposed person database', created: '2 hours ago' },
  { id: 'ALT-002', type: 'Sanctions', customer: 'Acme Holdings Ltd', severity: 'medium', details: 'Subsidiary in restricted jurisdiction', created: '4 hours ago' },
  { id: 'ALT-003', type: 'Adverse Media', customer: 'Global Ventures Inc', severity: 'low', details: 'News article mention - review required', created: '1 day ago' },
];

const mockDocChecks = [
  { doc: 'Passport', customer: 'John Mitchell', status: 'verified', confidence: 99, checks: ['Authenticity', 'Expiry', 'Face Match'] },
  { doc: 'Utility Bill', customer: 'John Mitchell', status: 'verified', confidence: 95, checks: ['Address Match', 'Date Valid'] },
  { doc: 'Company Registration', customer: 'Acme Holdings Ltd', status: 'pending', confidence: 0, checks: ['Authenticity', 'Directors Match'] },
];

export function KYCTemplate({ workflow }: Props) {
  const [activeView, setActiveView] = useState<'queue' | 'alerts' | 'documents'>('queue');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  return (
    <div className="p-6">
      {/* Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Pending Review</span>
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">47</p>
          <p className="text-xs text-amber-600 mt-1">12 high priority</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Alerts</span>
            <div className="p-1.5 bg-red-100 rounded-lg">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-red-600 mt-1">3 critical</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Verified Today</span>
            <div className="p-1.5 bg-green-100 rounded-lg">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% vs avg</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Avg Time</span>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.2h</p>
          <p className="text-xs text-blue-600 mt-1">Per application</p>
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
          <p className="text-2xl font-bold text-gray-900">78%</p>
          <p className="text-xs text-gray-500 mt-1">Auto-verified</p>
        </div>
      </div>

      {/* Views */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveView('queue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeView === 'queue' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          👤 Review Queue
        </button>
        <button
          onClick={() => setActiveView('alerts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeView === 'alerts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          🚨 Risk Alerts
        </button>
        <button
          onClick={() => setActiveView('documents')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeView === 'documents' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          📄 Document Checks
        </button>
      </div>

      {/* Queue View */}
      {activeView === 'queue' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="text" placeholder="Search customers..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64" />
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Status</option>
                <option>Pending Review</option>
                <option>Pending Docs</option>
                <option>Flagged</option>
                <option>Verified</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Risk Levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      customer.type === 'Individual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.country}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      customer.risk === 'High' ? 'bg-red-100 text-red-800' :
                      customer.risk === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {customer.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      customer.status === 'verified' ? 'bg-green-100 text-green-800' :
                      customer.status === 'flagged' ? 'bg-red-100 text-red-800' :
                      customer.status === 'pending_review' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.submitted}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Review →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Alerts View */}
      {activeView === 'alerts' && (
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-5 ${
              alert.severity === 'high' ? 'border-red-500' :
              alert.severity === 'medium' ? 'border-amber-500' :
              'border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{alert.type}</span>
                    <span className="text-xs text-gray-500">• {alert.created}</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Customer: {alert.customer}</p>
                  <p className="text-sm text-gray-600">{alert.details}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Dismiss
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Investigate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents View */}
      {activeView === 'documents' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {mockDocChecks.map((doc, idx) => (
              <div key={idx} className="p-5 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      doc.status === 'verified' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <svg className={`w-6 h-6 ${
                        doc.status === 'verified' ? 'text-green-600' : 'text-amber-600'
                      }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15h0M7 11h0M7 7h10"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{doc.doc}</p>
                      <p className="text-sm text-gray-600">{doc.customer}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {doc.checks.map((check, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {check}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {doc.status === 'verified' && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Confidence</p>
                        <p className="text-lg font-bold text-green-600">{doc.confidence}%</p>
                      </div>
                    )}
                    <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedCustomer.risk === 'High' ? 'bg-red-100 text-red-800' :
                    selectedCustomer.risk === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedCustomer.risk} Risk
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedCustomer.type === 'Individual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedCustomer.type}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-sm text-gray-500">{selectedCustomer.id}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Verification Checklist</h3>
              <div className="space-y-3">
                {['Identity Document', 'Proof of Address', 'Sanctions Check', 'PEP Screening', 'Adverse Media'].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{item}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      idx < 2 ? 'bg-green-100 text-green-800' :
                      idx === 2 ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {idx < 2 ? '✓ Complete' : idx === 2 ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                Flag for Review
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                Request Documents
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                Approve Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
