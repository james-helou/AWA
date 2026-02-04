import React, { useMemo } from 'react';
import { Workflow } from '../types/workflow';
import { CorporateActionsTemplate } from './demos/CorporateActionsTemplate';
import { KYCTemplate } from './demos/KYCTemplate';
import { TradeSettlementTemplate } from './demos/TradeSettlementTemplate';
import { GenericTemplate } from './demos/GenericTemplate';

interface DynamicWorkflowDemoProps {
  workflow: Workflow;
  onBack: () => void;
}

// Detect what type of workflow this is based on keywords
function detectWorkflowType(workflow: Workflow): 'corporate-actions' | 'kyc' | 'trade-settlement' | 'generic' {
  const name = workflow.name.toLowerCase();
  const description = workflow.description.toLowerCase();
  const combined = `${name} ${description}`;
  
  // Check for corporate actions keywords
  if (combined.includes('corporate action') || 
      combined.includes('dividend') || 
      combined.includes('proxy') ||
      combined.includes('merger') ||
      combined.includes('stock split') ||
      combined.includes('rights issue')) {
    return 'corporate-actions';
  }
  
  // Check for KYC/AML keywords
  if (combined.includes('kyc') || 
      combined.includes('know your customer') ||
      combined.includes('aml') ||
      combined.includes('anti-money') ||
      combined.includes('onboarding') ||
      combined.includes('customer verification') ||
      combined.includes('identity verification') ||
      combined.includes('compliance check')) {
    return 'kyc';
  }
  
  // Check for trade/settlement keywords
  if (combined.includes('trade') || 
      combined.includes('settlement') ||
      combined.includes('clearing') ||
      combined.includes('matching') ||
      combined.includes('execution') ||
      combined.includes('reconciliation') ||
      combined.includes('position')) {
    return 'trade-settlement';
  }
  
  return 'generic';
}

export function DynamicWorkflowDemo({ workflow, onBack }: DynamicWorkflowDemoProps) {
  const workflowType = useMemo(() => detectWorkflowType(workflow), [workflow]);
  
  // Get the template label for display
  const templateLabel = {
    'corporate-actions': 'Corporate Actions',
    'kyc': 'KYC / Compliance',
    'trade-settlement': 'Trade Settlement',
    'generic': 'Custom Workflow'
  }[workflowType];

  const templateColor = {
    'corporate-actions': 'bg-blue-100 text-blue-800',
    'kyc': 'bg-purple-100 text-purple-800',
    'trade-settlement': 'bg-green-100 text-green-800',
    'generic': 'bg-gray-100 text-gray-800'
  }[workflowType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="group p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                </svg>
              </button>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-500/25 animate-float">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold gradient-text">{workflow.name}</h1>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${templateColor} animate-fade-in`}>
                    {templateLabel} Template
                  </span>
                </div>
                <p className="text-sm text-gray-600">{workflow.agents.length}-Agent Workflow • Live Preview</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-green-50 rounded-xl border border-green-200 shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Active</span>
              </div>
              <span className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full shadow-sm animate-pulse-soft">
                INTERACTIVE PREVIEW
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Render the appropriate template based on workflow type */}
      <div className="animate-fade-in-up">
        {workflowType === 'corporate-actions' && <CorporateActionsTemplate workflow={workflow} />}
        {workflowType === 'kyc' && <KYCTemplate workflow={workflow} />}
        {workflowType === 'trade-settlement' && <TradeSettlementTemplate workflow={workflow} />}
        {workflowType === 'generic' && <GenericTemplate workflow={workflow} />}
      </div>
    </div>
  );
}
