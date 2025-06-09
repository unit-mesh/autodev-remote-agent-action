# AutoDev GitHub Agent Action

🤖 Automated GitHub issue analysis using AI-powered code analysis. This action automatically analyzes GitHub issues when they are created or updated, providing intelligent insights and recommendations.

## Features

- 🔍 **Intelligent Issue Analysis**: AI-powered analysis of GitHub issues with code context
- 💬 **Automated Comments**: Automatically add analysis results as comments to issues
- 🏷️ **Smart Labeling**: Automatically apply relevant labels based on analysis
- 🌐 **Webhook Support**: Standalone webhook server for real-time issue processing
- ⚙️ **Configurable**: Flexible configuration options for different workflows
- 🔗 **Integration Ready**: Built on top of the proven AutoDev GitHub Agent
- 🍽️ **Dogfooding**: We use our own action to analyze issues in this repository!

## Quick Start

### Prerequisites

Before using this action, you need:
1. A GitHub repository
2. An API key from one of the supported LLM providers (OpenAI, DeepSeek, or GLM)

### Setup Steps

1. **Add API Key Secret**:
   - Go to your repository's **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add `DEEPSEEK_TOKEN` (or `OPENAI_API_KEY`/`GLM_TOKEN`) with your API key

2. **Create Workflow File**:
   - Create `.github/workflows/issue-analysis.yml` in your repository

3. **Configure the Action**:
   - Use the configuration examples below

### GitHub Actions Usage

Add this action to your workflow file (e.g., `.github/workflows/issue-analysis.yml`):

```yaml
name: Analyze Issues
on:
  issues:
    types: [opened, edited, reopened]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Analyze Issue
        uses: unit-mesh/autodev-remote-agent-action@v0.3.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}  # or use openai-api-key/glm-token
          analysis-depth: medium
          auto-comment: true
          auto-label: true
```

### Standalone Webhook Server

```bash
# Install dependencies
npm install

# Set environment variables
export GITHUB_TOKEN="your-github-token"
export WEBHOOK_SECRET="your-webhook-secret"
export DEEPSEEK_TOKEN="your-deepseek-token"  # or OPENAI_API_KEY/GLM_TOKEN

# Start the server
npx autodev-github-action server --port 3000
```

### CLI Usage

```bash
# Analyze a specific issue
npx autodev-github-action analyze \
  --owner unit-mesh \
  --repo autodev-workbench \
  --issue 81 \
  --depth deep

# Start webhook server
npx autodev-github-action server --port 3000

# Validate configuration
npx autodev-github-action validate
```

## Configuration

### Action Inputs

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `github-token` | GitHub token for API access | `${{ github.token }}` | Yes |
| `deepseek-token` | DeepSeek API token for LLM analysis | `` | No* |
| `openai-api-key` | OpenAI API key for LLM analysis | `` | No* |
| `glm-token` | GLM API token for LLM analysis | `` | No* |
| `workspace-path` | Path to repository workspace | `${{ github.workspace }}` | No |
| `analysis-depth` | Analysis depth (shallow/medium/deep) | `medium` | No |
| `auto-comment` | Add analysis comment to issues | `true` | No |
| `auto-label` | Add labels based on analysis | `true` | No |
| `trigger-events` | Events that trigger analysis | `opened,edited,reopened` | No |
| `exclude-labels` | Labels to exclude from analysis | `` | No |
| `include-labels` | Labels to include for analysis | `` | No |
| `webhook-secret` | Secret for webhook verification | `` | No |

*At least one LLM API key is required for AI analysis

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub personal access token | Required |
| `DEEPSEEK_TOKEN` | DeepSeek API token for LLM analysis | Optional* |
| `OPENAI_API_KEY` | OpenAI API key for LLM analysis | Optional* |
| `GLM_TOKEN` | GLM API token for LLM analysis | Optional* |
| `WEBHOOK_SECRET` | Secret for webhook verification | Optional |
| `WORKSPACE_PATH` | Repository workspace path | `process.cwd()` |
| `AUTO_COMMENT` | Auto-add comments | `true` |
| `AUTO_LABEL` | Auto-add labels | `true` |
| `ANALYSIS_DEPTH` | Analysis depth | `medium` |
| `TRIGGER_EVENTS` | Trigger events | `opened,edited,reopened` |
| `EXCLUDE_LABELS` | Exclude labels | `` |
| `INCLUDE_LABELS` | Include labels | `` |

*At least one LLM API key is required for AI analysis

## LLM Configuration

This action supports multiple LLM providers. You need to configure at least one API key:

### DeepSeek (Recommended)
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
```

### OpenAI
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

### GLM (ChatGLM)
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    glm-token: ${{ secrets.GLM_TOKEN }}
```

### Setting up API Keys

1. Go to your repository's **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add one of the following secrets:
   - `DEEPSEEK_TOKEN`: Your DeepSeek API token from [DeepSeek Platform](https://platform.deepseek.com/)
   - `OPENAI_API_KEY`: Your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - `GLM_TOKEN`: Your GLM API token from [GLM Platform](https://open.bigmodel.cn/)

## Analysis Depths

### Shallow
- Quick analysis focusing on obvious patterns
- Fast execution (< 30 seconds)
- Basic code references
- Suitable for high-volume repositories

### Medium (Default)
- Balanced analysis with meaningful insights
- Moderate execution time (30-60 seconds)
- Comprehensive code exploration
- Good for most use cases

### Deep
- In-depth analysis including dependencies
- Longer execution time (60-120 seconds)
- Architectural pattern analysis
- Best for complex issues

## Examples

### Basic Issue Analysis

```yaml
- name: Analyze Issues
  uses: unit-mesh/autodev-remote-agent-action@v0.3.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
```

### Advanced Configuration

```yaml
- name: Advanced Issue Analysis
  uses: unit-mesh/autodev-remote-agent-action@v0.3.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    analysis-depth: deep
    auto-comment: true
    auto-label: true
    exclude-labels: 'wontfix,duplicate'
    include-labels: 'bug,enhancement'
```

### Webhook Server Setup

```javascript
const { startWebhookServer } = require('@autodev/github-agent-action');

const server = await startWebhookServer({
  port: 3000,
  webhookSecret: process.env.WEBHOOK_SECRET,
  githubToken: process.env.GITHUB_TOKEN
});
```

## API Reference

### GitHubActionService

Main service class for processing issues.

```typescript
const service = new GitHubActionService({
  githubToken: 'your-token',
  workspacePath: '/path/to/repo',
  autoComment: true,
  autoLabel: true
});

const result = await service.processIssue({
  owner: 'unit-mesh',
  repo: 'autodev-workbench',
  issueNumber: 81
});
```

### IssueAnalyzer

Core analysis engine.

```typescript
const analyzer = new IssueAnalyzer(context);
const result = await analyzer.analyzeIssue({
  depth: 'medium',
  includeCodeSearch: true,
  includeSymbolAnalysis: true
});
```

### WebhookHandler

Webhook server for real-time processing.

```typescript
const handler = new WebhookHandler(actionService, {
  port: 3000,
  secret: 'webhook-secret',
  onIssueOpened: async (payload) => {
    console.log('Issue opened:', payload.issue.number);
  }
});

await handler.start();
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/unit-mesh/autodev-remote-agent-action.git
cd autodev-remote-agent-action

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

### Project Structure

```
autodev-remote-agent-action/
├── src/
│   ├── action.ts           # Main action service
│   ├── issue-analyzer.ts   # Issue analysis logic
│   ├── webhook-handler.ts  # Webhook server
│   ├── types/             # Type definitions
│   └── index.ts           # Main entry point
├── bin/
│   └── action.js          # CLI entry point
├── action.yml             # GitHub Action definition
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [AutoDev GitHub Agent](https://github.com/unit-mesh/autodev) - Core analysis engine
- [AutoDev Context Worker](https://github.com/unit-mesh/autodev) - Code context analysis
- [AutoDev Worker Core](https://github.com/unit-mesh/autodev) - Core utilities

## Support

- 📖 [Documentation](https://github.com/unit-mesh/autodev-remote-agent-action)
- 🐛 [Issue Tracker](https://github.com/unit-mesh/autodev-remote-agent-action/issues)
- 💬 [Discussions](https://github.com/unit-mesh/autodev-remote-agent-action/discussions)
