# AutoDev GitHub Agent Action

🤖 Automated GitHub issue analysis using AI-powered code analysis. This action automatically analyzes GitHub issues when they are created or updated, providing intelligent insights and recommendations.

## Features

- 🔍 **Intelligent Issue Analysis**: AI-powered analysis of GitHub issues with code context
- 💬 **Automated Comments**: Automatically add analysis results as comments to issues
- 🏷️ **Smart Labeling**: Automatically apply relevant labels based on analysis
- 🌐 **Webhook Support**: Standalone webhook server for real-time issue processing
- ⚙️ **Configurable**: Flexible configuration options for different workflows
- 🔗 **Integration Ready**: Built on top of the proven AutoDev GitHub Agent
- 🔍 **Process Transparency**: Detailed analysis process information and file filtering insights
- 🛠️ **Diagnostic Information**: Clear explanations when analysis results are limited
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
        uses: unit-mesh/autodev-remote-agent-action@v0.3.1
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
| `include-config-files` | Include configuration files in analysis | `true` | No |
| `include-test-files` | Include test files in analysis | `true` | No |
| `include-patterns` | File patterns to force include | `` | No |
| `exclude-patterns` | File patterns to exclude | `` | No |
| `force-include-files` | Specific files to always include | `` | No |
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
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
```

### OpenAI
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

### GLM (ChatGLM)
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
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

## 🔍 Analysis Transparency

This action provides detailed information about the analysis process to help you understand what happened:

### Process Information
- **Files Scanned**: Total number of files found in your repository
- **Files Analyzed**: Number of files the AI determined were relevant
- **Files Filtered**: Number of files excluded from analysis and why
- **Analysis Steps**: Detailed breakdown of each analysis phase
- **LLM Calls**: Information about AI service calls and their success/failure

### When Analysis Results Are Limited
If the analysis produces limited results, the action will provide:
- **Diagnostic Information**: Explanation of what might have gone wrong
- **File Filtering Details**: Which types of files were excluded and why
- **Improvement Suggestions**: How to write better issue descriptions for more comprehensive analysis
- **Troubleshooting Tips**: Common issues and how to resolve them

### Common File Filtering Scenarios
The AI may filter out files that seem unrelated to your issue:
- Configuration files (jest.config.js, rollup.config.mjs, etc.) unless specifically mentioned
- Test setup files unless the issue is about testing
- Build and package files unless the issue mentions dependencies or build problems
- Documentation files unless the issue is about documentation

💡 **Tips for Better Analysis Results**:

1. **Mention specific files**: "Error in `jest.config.js`" vs "Configuration problem"
2. **Include error messages**: Copy-paste actual error text
3. **Reference functions/classes**: "Issue in `getUserData()` function"
4. **Specify file types**: "Test configuration issue" includes test files
5. **Use keywords**: "build", "config", "test", "dependency" help include relevant files

### Understanding Analysis Comments

When the action analyzes your issue, it will add a comment with sections like:

```markdown
## 🤖 Automated Issue Analysis

### 🔍 Analysis Process
- Files scanned: 45
- Files analyzed: 8
- Files filtered: 37 (see details below)
- Analysis steps: 5

### ⚠️ Files Filtered from Analysis
37 files were not included in the analysis. This may include:
- jest.config.js - Configuration files often filtered by LLM as not directly relevant
- rollup.config.mjs - Build configuration files typically excluded from issue analysis
- __tests__/setup.ts - Test setup files may be filtered if issue doesn't mention testing

💡 Suggestions to include these files:
- Mention "configuration", "config files", or specific config file names if your issue relates to build/setup
- Include "test", "testing", or "test failure" if your issue involves test problems
```

This transparency helps you understand why certain files weren't considered and how to improve your issue description for better analysis.

## Examples

### Basic Issue Analysis

```yaml
- name: Analyze Issues
  uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
```

### Advanced Configuration

```yaml
- name: Advanced Issue Analysis
  uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    analysis-depth: deep
    auto-comment: true
    auto-label: true
    exclude-labels: 'wontfix,duplicate'
    include-labels: 'bug,enhancement'
```

### File Filtering Configuration

Control which files are included in the analysis:

```yaml
- name: Custom File Filtering
  uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    # File inclusion settings
    include-config-files: true    # Include jest.config.js, rollup.config.mjs, etc.
    include-test-files: true      # Include __tests__/, *.test.js, etc.
    # Custom patterns (comma-separated)
    include-patterns: "*.config.js,*.config.ts,docker-compose.yml"
    exclude-patterns: "*.min.js,*.bundle.js"
    force-include-files: "important-config.js,critical-setup.ts"
```

### Transparency and Diagnostics

The action now provides detailed process information in comments:

```yaml
- name: Analysis with Full Transparency
  uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    auto-comment: true  # Comments will include process details
    analysis-depth: medium
```

**What you'll see in analysis comments:**
- 📊 **Process Summary**: Files scanned vs. analyzed vs. filtered
- ⚠️ **Filtered Files**: Specific files that were excluded and why
- 🔄 **Analysis Steps**: Each step's success/failure with timing
- 🧠 **LLM Calls**: AI service calls and any errors
- 💡 **Improvement Suggestions**: How to get better analysis results

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

# Install dependencies (using pnpm for better dependency management)
pnpm install
# or use npm
npm install

# Build the package
npm run build

# Run tests
npm test

# Test locally
node dist/index.js --help
```

### Build Process

```bash
# Clean build (removes dist/ and rebuilds)
npm run build:clean

# Development build with watch mode
npm run dev

# Lint code
npm run lint

# Test locally
node dist/index.js --help
```

### Project Structure

```
autodev-remote-agent-action/
├── src/                   # Source code (TypeScript)
│   ├── action.ts           # Main action service
│   ├── issue-analyzer.ts   # Issue analysis logic
│   ├── webhook-handler.ts  # Webhook server
│   ├── types/             # Type definitions
│   └── index.ts           # Main entry point
├── dist/                  # Build output (committed to git)
├── bin/
│   └── action.js          # CLI entry point
├── action.yml             # GitHub Action definition
├── package.json
└── README.md
```

### Release Process

1. Make your changes and test locally
2. Run `npm run build:clean` to ensure clean build
3. Test the built action: `node dist/index.js`
4. Update version in `package.json`
5. Commit all changes including `dist/` files
6. Create a git tag: `git tag v0.3.3 && git push origin v0.3.3`
7. The new version will be available for use in GitHub Actions

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
