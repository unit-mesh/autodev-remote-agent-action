# AutoDev GitHub Agent Action

🤖 **Automated GitHub issue analysis using AI-powered code analysis**

## 🌟 Features

- **🔍 Intelligent Issue Analysis**: AI-powered analysis of GitHub issues with code context
- **💬 Automated Comments**: Automatically add analysis results as comments to issues
- **🏷️ Smart Labeling**: Automatically apply relevant labels based on analysis
- **⚙️ Configurable**: Flexible configuration options for different workflows
- **🚀 Easy Setup**: Simple integration with existing GitHub workflows
- **🔍 Process Transparency**: See exactly what files were analyzed and why others were filtered
- **🛠️ Smart File Filtering**: Control which files are included in analysis with patterns and rules
- **📊 Diagnostic Information**: Get detailed explanations when analysis results are limited

## 🚀 Quick Start

Add this action to your workflow file (e.g., `.github/workflows/issue-analysis.yml`):

```yaml
name: Automated Issue Analysis
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
          deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
          analysis-depth: medium
          auto-comment: true
          auto-label: true
```

## 📋 Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | Yes | `${{ github.token }}` |
| `deepseek-token` | DeepSeek API token for LLM analysis | No | - |
| `openai-api-key` | OpenAI API key for LLM analysis | No | - |
| `glm-token` | GLM API token for LLM analysis | No | - |
| `analysis-depth` | Analysis depth (shallow/medium/deep) | No | `medium` |
| `auto-comment` | Add analysis comment to issues | No | `true` |
| `auto-label` | Add labels based on analysis | No | `true` |
| `exclude-labels` | Labels to exclude from analysis | No | - |
| `include-labels` | Labels to include for analysis | No | - |

## 📊 Outputs

| Output | Description |
|--------|-------------|
| `success` | Whether the analysis was successful |
| `comment-added` | Whether a comment was added to the issue |
| `labels-added` | Comma-separated list of labels that were added |
| `execution-time` | Time taken to complete the analysis (in milliseconds) |
| `error` | Error message if the analysis failed |

## 🔑 Setup

1. **Add API Key**: Add one of the following secrets to your repository:
   - `DEEPSEEK_TOKEN` (recommended)
   - `OPENAI_API_KEY`
   - `GLM_TOKEN`

2. **Configure Workflow**: Add the action to your workflow file

3. **Test**: Create or edit an issue to see the analysis in action

## 📖 Examples

### Basic Configuration
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
```

### Advanced Configuration
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    analysis-depth: deep
    auto-comment: true
    auto-label: true
    exclude-labels: 'wontfix,duplicate'
    include-labels: 'bug,enhancement'
```

## 🎯 What It Does

When an issue is created, edited, or reopened, this action will:

1. **Analyze the issue content** using AI
2. **Search for relevant code** in your repository
3. **Generate intelligent insights** and recommendations
4. **Add a detailed comment** with analysis results (if enabled)
5. **Apply relevant labels** for better organization (if enabled)
6. **Provide transparency** about the analysis process and file filtering
7. **Offer suggestions** for improving issue descriptions when results are limited

## 🔍 New: Analysis Transparency

The action now provides detailed information about what happened during analysis:

### Process Visibility
- **Files Scanned**: Total files found in your repository
- **Files Analyzed**: Files the AI determined were relevant
- **Files Filtered**: Files excluded from analysis and why
- **Analysis Steps**: Each step's success/failure with timing
- **LLM Calls**: AI service interactions and any errors

### Smart Diagnostics
When analysis results are limited, you'll get:
- **Specific explanations** of why files were filtered
- **Actionable suggestions** for improving issue descriptions
- **File type recommendations** (mention "config", "test", etc.)
- **Example improvements** showing before/after issue descriptions

### Example Analysis Comment
```markdown
🔍 Analysis Process
- Files scanned: 45
- Files analyzed: 8
- Files filtered: 37 (see details below)

⚠️ Files Filtered from Analysis
- jest.config.js - Configuration files often filtered unless mentioned
- __tests__/setup.ts - Test files filtered when issue doesn't mention testing

💡 Suggestions to include these files:
- Mention "configuration" or "config files" for build/setup issues
- Include "test" or "testing" for test-related problems
```

## 🔧 Supported LLM Providers

- **DeepSeek** (DeepSeek-V2) - Recommended
- **OpenAI** (GPT-3.5, GPT-4)
- **GLM** (ChatGLM)

## 📚 Documentation

For detailed documentation, examples, and troubleshooting, visit:
- [GitHub Repository](https://github.com/unit-mesh/autodev-remote-agent-action)
- [Quick Start Guide](https://github.com/unit-mesh/autodev-remote-agent-action/blob/master/QUICK_START.md)

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](https://github.com/unit-mesh/autodev-remote-agent-action/blob/master/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/unit-mesh/autodev-remote-agent-action)
- 🐛 [Issue Tracker](https://github.com/unit-mesh/autodev-remote-agent-action/issues)
- 💬 [Discussions](https://github.com/unit-mesh/autodev-remote-agent-action/discussions)
