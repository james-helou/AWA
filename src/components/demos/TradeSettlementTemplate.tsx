import React, { useState } from 'react';
import { Workflow } from '../../types/workflow';

interface Props {
  workflow: Workflow;
}

const mockTrades = [
  { id: 'TRD-001', type: 'Buy', security: 'AAPL', quantity: '10,000', price: '$185.50', counterparty: 'Goldman Sachs', settlementDate: '2026-02-06', status: 'matched', value: '$1,855,000' },
  { id: 'TRD-002', type: 'Sell', security: 'GOOGL', quantity: '5,000', price: '$142.30', counterparty: 'Morgan Stanley', settlementDate: '2026-02-06', status: 'unmatched', value: '$711,500' },
  { id: 'TRD-003', type: 'Buy', security: 'MSFT', quantity: '8,000', price: '$410.20', counterparty: 'JP Morgan', settlementDate: '2026-02-07', status: 'settled', value: '$3,281,600' },
  { id: 'TRD-004', type: 'Sell', security: 'AMZN', quantity: '3,000', price: '$178.90', counterparty: 'Citadel', settlementDate: '2026-02-06', status: 'failed', value: '$536,700' },
  { id: 'TRD-005', type: 'Buy', security: 'NVDA', quantity: '2,500', price: '$875.00', counterparty: 'BlackRock', settlementDate: '2026-02-07', status: 'pending', value: '$2,187,500' },
];

const mockBreaks = [
  { id: 'BRK-001', trade: 'TRD-002', type: 'Quantity Mismatch', ourValue: '5,000', theirValue: '5,500', age: '2 days', priority: 'high' },
  { id: 'BRK-002', trade: 'TRD-004', type: 'Price Difference', ourValue: '$178.90', theirValue: '$179.10', age: '1 day', priority: 'medium' },
  { id: 'BRK-003', trade: 'TRD-006', type: 'Missing Allocation', ourValue: 'Present', theirValue: 'Missing', age: '3 hours', priority: 'low' },
];

const mockPositions = [
  { security: 'AAPL', cusip: '037833100', quantity: '125,000', avgCost: '$175.30', marketValue: '$23.1M', pnl: '+$1.2M' },
  { security: 'GOOGL', cusip: '02079K107', quantity: '45,000', avgCost: '$138.50', marketValue: '$6.4M', pnl: '+$170K' },
  { security: 'MSFT', cusip: '594918104', quantity: '80,000', avgCost: '$395.00', marketValue: '$32.8M', pnl: '+$1.2M' },
  { security: 'NVDA', cusip: '67066G104', quantity: '30,000', avgCost: '$820.00', marketValue: '$26.2M', pnl: '+$1.6M' },
];

export function TradeSettlementTemplate({ workflow }: Props) {
  const [activeView, setActiveView] = useState<'trades' | 'breaks' | 'positions'>('trades');
  const [selectedTrade, setSelectedTrade] = useState<typeof mockTrades[0] | null>(null);

  return (
    <div className="p-6">
      {/* Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Today's Trades</span>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Matched</span>
            <div className="p-1.5 bg-green-100 rounded-lg">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">1,189</p>
          <p className="text-xs text-green-600">95.3%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Unmatched</span>
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">42</p>
          <p className="text-xs text-amber-600">3.4%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Failed</span>
            <div className="p-1.5 bg-red-100 rounded-lg">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">16</p>
          <p className="text-xs text-red-600">1.3%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Trade Value</span>
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$2.4B</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Open Breaks</span>
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <svg className="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">23</p>
        </div>
      </div>

      {/* Views */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveView('trades')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeView === 'trades' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          📊 Trade Blotter
        </button>
        <button
          onClick={() => setActiveView('breaks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeView === 'breaks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          ⚠️ Breaks & Exceptions
        </button>
        <button
          onClick={() => setActiveView('positions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeView === 'positions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          📈 Positions
        </button>
      </div>

      {/* Trade Blotter */}
      {activeView === 'trades' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="text" placeholder="Search trades..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64" />
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Status</option>
                <option>Matched</option>
                <option>Unmatched</option>
                <option>Pending</option>
                <option>Settled</option>
                <option>Failed</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>Settlement: T+2</option>
                <option>Settlement: T+1</option>
                <option>Settlement: T+0</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              + New Trade
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trade ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Security</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Counterparty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Settle Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-blue-600">{trade.id}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      trade.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{trade.security}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{trade.quantity}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{trade.price}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{trade.value}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{trade.counterparty}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{trade.settlementDate}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trade.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                      trade.status === 'unmatched' ? 'bg-amber-100 text-amber-800' :
                      trade.status === 'settled' ? 'bg-green-100 text-green-800' :
                      trade.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Breaks View */}
      {activeView === 'breaks' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Open Breaks by Priority</h3>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-gray-600">High: 8</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-sm text-gray-600">Medium: 11</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-600">Low: 4</span>
                </div>
              </div>
            </div>
          </div>
          
          {mockBreaks.map((brk) => (
            <div key={brk.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-5 ${
              brk.priority === 'high' ? 'border-red-500' :
              brk.priority === 'medium' ? 'border-amber-500' :
              'border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      brk.priority === 'high' ? 'bg-red-100 text-red-800' :
                      brk.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {brk.priority.toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{brk.type}</span>
                    <span className="text-xs text-gray-500">• Age: {brk.age}</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-2">Trade: {brk.trade}</p>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">Our Value</p>
                      <p className="font-semibold text-gray-900">{brk.ourValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Their Value</p>
                      <p className="font-semibold text-gray-900">{brk.theirValue}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Investigate
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Positions View */}
      {activeView === 'positions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Current Positions</h3>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Market Value</p>
              <p className="text-xl font-bold text-gray-900">$88.5M</p>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Security</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">CUSIP</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Cost</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Market Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPositions.map((pos, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pos.security}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{pos.cusip}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{pos.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{pos.avgCost}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pos.marketValue}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{pos.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trade Detail Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTrade(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    selectedTrade.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedTrade.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedTrade.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                    selectedTrade.status === 'settled' ? 'bg-green-100 text-green-800' :
                    selectedTrade.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedTrade.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTrade.security}</h2>
                <p className="text-sm text-gray-500">{selectedTrade.id}</p>
              </div>
              <button onClick={() => setSelectedTrade(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase">Quantity</p>
                  <p className="text-lg font-semibold">{selectedTrade.quantity}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase">Price</p>
                  <p className="text-lg font-semibold">{selectedTrade.price}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase">Total Value</p>
                  <p className="text-lg font-semibold">{selectedTrade.value}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase">Settlement Date</p>
                  <p className="text-lg font-semibold">{selectedTrade.settlementDate}</p>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Counterparty</p>
                <p className="text-lg font-semibold">{selectedTrade.counterparty}</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                View Audit Trail
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Process Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
