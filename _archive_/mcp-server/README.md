# Workflow Planner MCP Server

An MCP (Model Context Protocol) server that provides intelligent workflow planning capabilities. It contains a knowledge base of agents, workflow patterns, and business rules that an LLM can query to build optimal multi-agent workflows.

## Features

### Agent Catalog
- 16 pre-defined agents for financial services workflows
- Each agent has: capabilities, inputs/outputs, compatible partners, domains
- Supports domains: corporate-actions, kyc, trading, settlement

### Workflow Patterns
- 8 common workflow patterns (extract-validate-enrich, corporate-action-processing, etc.)
- Each pattern includes agent sequence, use cases, and human touchpoints

### Business Rules
- Connection rules (which agents can connect to which)
- Human touchpoint triggers (when human review is needed)
- Domain-specific requirements (regulations, required agents)

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Usage with Claude Desktop

Add to your Claude Desktop config (`%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "workflow-planner": {
      "command": "node",
      "args": ["C:/Users/SQ239LB/Demo/mcp-server/dist/index.js"]
    }
  }
}
```

Then restart Claude Desktop.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_all_agents` | Get all agents in the catalog |
| `get_agent_details` | Get full details for a specific agent |
| `find_agents_by_capability` | Find agents with a specific capability |
| `find_agents_by_domain` | Find agents for a domain |
| `get_compatible_agents` | Get agents that work well together |
| `suggest_workflow_pattern` | Suggest a pattern for a use case |
| `list_all_patterns` | Get all workflow patterns |
| `validate_agent_pipeline` | Validate if agents can connect |
| `get_required_touchpoints` | Determine human touchpoints needed |
| `get_domain_requirements` | Get regulatory requirements for a domain |
| `generate_workflow_spec` | Generate a complete workflow specification |

## Example Prompts for Claude

Once connected, try these prompts:

1. "I need to build a workflow for processing corporate action announcements. What agents should I use?"

2. "Show me all agents that can do document extraction"

3. "What's the best workflow pattern for KYC customer onboarding?"

4. "Generate a complete workflow spec for trade settlement"

5. "What human touchpoints are needed for a high-value dividend processing workflow?"

## Integration with the Workflow Planner App

In the future, this MCP server can be called from a backend API:

```typescript
// Example backend integration
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

async function generateWorkflowWithMCP(description: string, domain: string) {
  const client = new Client({ name: "workflow-app" });
  // Connect to MCP server
  // Call generate_workflow_spec tool
  // Return result to frontend
}
```

## Adding New Agents

Edit `src/data/agents.json` to add new agents:

```json
{
  "id": "my-new-agent",
  "name": "My New Agent",
  "description": "What it does",
  "capabilities": ["cap1", "cap2"],
  "inputs": ["input-type"],
  "outputs": ["output-type"],
  "commonPartners": ["other-agent-id"],
  "domains": ["domain1"],
  "estimatedLatency": "1-2 seconds",
  "requiresHumanReview": false
}
```

Then rebuild: `npm run build`

## License

MIT
