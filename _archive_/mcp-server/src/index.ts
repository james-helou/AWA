#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const agentsData = JSON.parse(readFileSync(join(__dirname, "data/agents.json"), "utf-8"));
const patternsData = JSON.parse(readFileSync(join(__dirname, "data/patterns.json"), "utf-8"));
const rulesData = JSON.parse(readFileSync(join(__dirname, "data/rules.json"), "utf-8"));

// Types
interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  inputs: string[];
  outputs: string[];
  commonPartners: string[];
  domains: string[];
  estimatedLatency: string;
  requiresHumanReview: boolean;
  humanReviewTriggers?: string[];
  integrations?: string[];
  channels?: string[];
  humanTouchpointType?: string;
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  sequence: string[];
  useCases: string[];
  domains: string[];
  estimatedDuration: string;
  humanTouchpoints: string[];
}

const agents: Agent[] = agentsData.agents;
const patterns: Pattern[] = patternsData.patterns;
const rules = rulesData;

// Create server
const server = new Server(
  {
    name: "workflow-planner-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_all_agents",
        description: "Get a list of all available agents in the catalog with their capabilities",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_agent_details",
        description: "Get detailed information about a specific agent by ID",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "The ID of the agent to look up",
            },
          },
          required: ["agentId"],
        },
      },
      {
        name: "find_agents_by_capability",
        description: "Find agents that have a specific capability (e.g., 'ocr', 'validation', 'routing')",
        inputSchema: {
          type: "object",
          properties: {
            capability: {
              type: "string",
              description: "The capability to search for",
            },
          },
          required: ["capability"],
        },
      },
      {
        name: "find_agents_by_domain",
        description: "Find agents suitable for a specific domain (e.g., 'finance', 'kyc', 'trading')",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "The domain to filter by (finance, kyc, trading, corporate-actions, settlement, etc.)",
            },
          },
          required: ["domain"],
        },
      },
      {
        name: "get_compatible_agents",
        description: "Get agents that commonly work well with a specific agent",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "The ID of the agent to find compatible partners for",
            },
          },
          required: ["agentId"],
        },
      },
      {
        name: "suggest_workflow_pattern",
        description: "Suggest a workflow pattern based on a use case description",
        inputSchema: {
          type: "object",
          properties: {
            useCase: {
              type: "string",
              description: "Description of the use case (e.g., 'invoice processing', 'customer onboarding')",
            },
            domain: {
              type: "string",
              description: "Optional domain filter",
            },
          },
          required: ["useCase"],
        },
      },
      {
        name: "list_all_patterns",
        description: "Get all available workflow patterns",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "validate_agent_pipeline",
        description: "Validate if a sequence of agents can work together",
        inputSchema: {
          type: "object",
          properties: {
            agentIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of agent IDs in the proposed sequence",
            },
          },
          required: ["agentIds"],
        },
      },
      {
        name: "get_required_touchpoints",
        description: "Determine what human touchpoints are needed for a workflow",
        inputSchema: {
          type: "object",
          properties: {
            agentIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of agent IDs in the workflow",
            },
            domain: {
              type: "string",
              description: "The domain of the workflow",
            },
            isHighValue: {
              type: "boolean",
              description: "Whether this involves high-value transactions",
            },
          },
          required: ["agentIds"],
        },
      },
      {
        name: "get_domain_requirements",
        description: "Get regulatory and compliance requirements for a domain",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "The domain to get requirements for",
            },
          },
          required: ["domain"],
        },
      },
      {
        name: "generate_workflow_spec",
        description: "Generate a complete workflow specification based on requirements",
        inputSchema: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "Natural language description of the workflow needed",
            },
            domain: {
              type: "string",
              description: "The domain (corporate-actions, kyc, trading, settlement)",
            },
            includeHumanTouchpoints: {
              type: "boolean",
              description: "Whether to include human touchpoints",
              default: true,
            },
          },
          required: ["description", "domain"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "list_all_agents": {
      const agentList = agents.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        domains: a.domains,
        capabilities: a.capabilities,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(agentList, null, 2),
          },
        ],
      };
    }

    case "get_agent_details": {
      const agentId = args?.agentId as string;
      const agent = agents.find((a) => a.id === agentId);
      if (!agent) {
        return {
          content: [
            {
              type: "text",
              text: `Agent not found: ${agentId}. Use list_all_agents to see available agents.`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(agent, null, 2),
          },
        ],
      };
    }

    case "find_agents_by_capability": {
      const capability = (args?.capability as string).toLowerCase();
      const matching = agents.filter((a) =>
        a.capabilities.some((c) => c.toLowerCase().includes(capability))
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              matching.map((a) => ({
                id: a.id,
                name: a.name,
                capabilities: a.capabilities,
                description: a.description,
              })),
              null,
              2
            ),
          },
        ],
      };
    }

    case "find_agents_by_domain": {
      const domain = (args?.domain as string).toLowerCase();
      const matching = agents.filter(
        (a) =>
          a.domains.includes("all") ||
          a.domains.some((d) => d.toLowerCase().includes(domain))
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              matching.map((a) => ({
                id: a.id,
                name: a.name,
                domains: a.domains,
                description: a.description,
              })),
              null,
              2
            ),
          },
        ],
      };
    }

    case "get_compatible_agents": {
      const agentId = args?.agentId as string;
      const agent = agents.find((a) => a.id === agentId);
      if (!agent) {
        return {
          content: [
            {
              type: "text",
              text: `Agent not found: ${agentId}`,
            },
          ],
        };
      }
      const compatible = agents.filter((a) =>
        agent.commonPartners.includes(a.id)
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                agent: agent.name,
                compatiblePartners: compatible.map((a) => ({
                  id: a.id,
                  name: a.name,
                  description: a.description,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "suggest_workflow_pattern": {
      const useCase = (args?.useCase as string).toLowerCase();
      const domain = args?.domain as string | undefined;

      let matching = patterns.filter((p) =>
        p.useCases.some((uc) => uc.toLowerCase().includes(useCase)) ||
        p.description.toLowerCase().includes(useCase) ||
        p.name.toLowerCase().includes(useCase)
      );

      if (domain) {
        matching = matching.filter(
          (p) => p.domains.includes("all") || p.domains.includes(domain.toLowerCase())
        );
      }

      if (matching.length === 0) {
        // Try to find by domain at least
        matching = patterns.filter(
          (p) =>
            p.domains.includes("all") ||
            (domain && p.domains.includes(domain.toLowerCase()))
        );
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                searchedFor: useCase,
                suggestedPatterns: matching.map((p) => ({
                  id: p.id,
                  name: p.name,
                  description: p.description,
                  sequence: p.sequence,
                  estimatedDuration: p.estimatedDuration,
                  humanTouchpoints: p.humanTouchpoints,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "list_all_patterns": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(patterns, null, 2),
          },
        ],
      };
    }

    case "validate_agent_pipeline": {
      const agentIds = args?.agentIds as string[];
      const validationResults: {
        valid: boolean;
        errors: string[];
        warnings: string[];
        suggestions: string[];
      } = {
        valid: true,
        errors: [],
        warnings: [],
        suggestions: [],
      };

      // Check all agents exist
      for (const id of agentIds) {
        if (!agents.find((a) => a.id === id)) {
          validationResults.valid = false;
          validationResults.errors.push(`Unknown agent: ${id}`);
        }
      }

      if (!validationResults.valid) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(validationResults, null, 2),
            },
          ],
        };
      }

      // Check connections
      for (let i = 0; i < agentIds.length - 1; i++) {
        const fromAgent = agents.find((a) => a.id === agentIds[i])!;
        const toAgentId = agentIds[i + 1];

        if (!fromAgent.commonPartners.includes(toAgentId)) {
          validationResults.warnings.push(
            `${fromAgent.id} -> ${toAgentId} is not a common pairing. This may work but is unusual.`
          );
        }
      }

      // Check for missing common patterns
      const hasValidator = agentIds.includes("data-validator");
      const hasExtractor = agentIds.includes("document-extractor");
      
      if (hasExtractor && !hasValidator) {
        validationResults.suggestions.push(
          "Consider adding data-validator after document-extractor for data quality"
        );
      }

      // Check for exception handling
      if (agentIds.length > 2 && !agentIds.includes("exception-handler")) {
        validationResults.suggestions.push(
          "Consider adding exception-handler for error recovery"
        );
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(validationResults, null, 2),
          },
        ],
      };
    }

    case "get_required_touchpoints": {
      const agentIds = args?.agentIds as string[];
      const domain = args?.domain as string | undefined;
      const isHighValue = args?.isHighValue as boolean | undefined;

      const touchpoints: Array<{
        type: string;
        reason: string;
        agent: string;
        required: boolean;
      }> = [];

      for (const id of agentIds) {
        const agent = agents.find((a) => a.id === id);
        if (!agent) continue;

        if (agent.requiresHumanReview) {
          touchpoints.push({
            type: agent.humanTouchpointType || "review",
            reason: `${agent.name} requires human involvement`,
            agent: agent.id,
            required: true,
          });
        }

        if (agent.humanReviewTriggers) {
          for (const trigger of agent.humanReviewTriggers) {
            touchpoints.push({
              type: "conditional-review",
              reason: `Triggered by: ${trigger}`,
              agent: agent.id,
              required: false,
            });
          }
        }
      }

      // Add high-value touchpoint if applicable
      if (isHighValue) {
        touchpoints.push({
          type: "approval",
          reason: "High-value transaction requires approval",
          agent: "workflow",
          required: true,
        });
      }

      // Add domain-specific touchpoints
      if (domain) {
        const domainReqs = rules.domainRequirements[domain as keyof typeof rules.domainRequirements];
        if (domainReqs) {
          touchpoints.push({
            type: "compliance-review",
            reason: `Domain ${domain} has regulations: ${domainReqs.regulations.join(", ")}`,
            agent: "workflow",
            required: false,
          });
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                touchpoints,
                summary: {
                  required: touchpoints.filter((t) => t.required).length,
                  conditional: touchpoints.filter((t) => !t.required).length,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "get_domain_requirements": {
      const domain = args?.domain as string;
      const domainKey = domain.toLowerCase().replace(/\s+/g, "-");
      const requirements = rules.domainRequirements[domainKey as keyof typeof rules.domainRequirements];

      if (!requirements) {
        return {
          content: [
            {
              type: "text",
              text: `No specific requirements found for domain: ${domain}. Available domains: ${Object.keys(rules.domainRequirements).join(", ")}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                domain,
                ...requirements,
                requiredAgentDetails: requirements.requiredAgents.map((id: string) => {
                  const agent = agents.find((a) => a.id === id);
                  return agent
                    ? { id: agent.id, name: agent.name, description: agent.description }
                    : { id, name: "Unknown", description: "" };
                }),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_workflow_spec": {
      const description = args?.description as string;
      const domain = args?.domain as string;
      const includeHumanTouchpoints = args?.includeHumanTouchpoints !== false;

      // Find matching pattern
      const matchingPatterns = patterns.filter(
        (p) =>
          p.domains.includes(domain) ||
          p.domains.includes("all") ||
          p.useCases.some((uc) => description.toLowerCase().includes(uc))
      );

      const bestPattern = matchingPatterns[0];

      // Get domain requirements
      const domainReqs = rules.domainRequirements[domain as keyof typeof rules.domainRequirements];

      // Build agent list
      let agentIds = bestPattern?.sequence || [];
      
      // Add required agents from domain
      if (domainReqs) {
        for (const reqAgent of domainReqs.requiredAgents) {
          if (!agentIds.includes(reqAgent)) {
            agentIds.push(reqAgent);
          }
        }
      }

      // Get full agent details
      const workflowAgents = agentIds
        .map((id) => agents.find((a) => a.id === id))
        .filter((a): a is Agent => a !== undefined)
        .map((agent, index) => ({
          id: agent.id,
          name: agent.name,
          order: index + 1,
          type: agent.requiresHumanReview ? "human-in-loop" : "automated",
          description: agent.description,
          capabilities: agent.capabilities,
          inputs: agent.inputs,
          outputs: agent.outputs,
          estimatedLatency: agent.estimatedLatency,
        }));

      // Determine touchpoints
      const touchpoints: Array<{
        id: string;
        agentId: string;
        name: string;
        type: string;
        description: string;
        required: boolean;
      }> = [];

      if (includeHumanTouchpoints) {
        for (const agent of workflowAgents) {
          const fullAgent = agents.find((a) => a.id === agent.id);
          if (fullAgent?.requiresHumanReview) {
            touchpoints.push({
              id: `tp-${agent.id}`,
              agentId: agent.id,
              name: `${agent.name} Review`,
              type: fullAgent.humanTouchpointType || "review",
              description: `Human review required for ${agent.name}`,
              required: true,
            });
          }
        }
      }

      // Determine data sources
      const dataSources = domainReqs?.dataSources.map((ds: string, i: number) => ({
        id: `ds-${i}`,
        name: ds.toUpperCase(),
        type: "integration",
        description: `Integration with ${ds}`,
      })) || [];

      const workflowSpec = {
        name: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Workflow`,
        description: description,
        domain: domain,
        pattern: bestPattern?.name || "Custom",
        agents: workflowAgents,
        dataSources,
        humanTouchpoints: touchpoints,
        estimatedDuration: bestPattern?.estimatedDuration || "varies",
        regulations: domainReqs?.regulations || [],
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(workflowSpec, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
});

// List resources (for browsing agent/pattern data)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "workflow://agents",
        name: "Agent Catalog",
        description: "Complete catalog of available agents",
        mimeType: "application/json",
      },
      {
        uri: "workflow://patterns",
        name: "Workflow Patterns",
        description: "Common workflow patterns and templates",
        mimeType: "application/json",
      },
      {
        uri: "workflow://rules",
        name: "Connection Rules",
        description: "Rules for agent connections and human touchpoints",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "workflow://agents":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(agents, null, 2),
          },
        ],
      };
    case "workflow://patterns":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(patterns, null, 2),
          },
        ],
      };
    case "workflow://rules":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(rules, null, 2),
          },
        ],
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Workflow Planner MCP Server running on stdio");
}

main().catch(console.error);
