# Configuration Guide

This guide covers all configuration options for the AutoDev Remote Agent, including the new transparency and file filtering features.

## 🚀 Quick Start Configurations

### Basic Setup
```yaml
name: Issue Analysis
on:
  issues:
    types: [opened, edited, reopened]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: unit-mesh/autodev-remote-agent-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
```

### Production Setup
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    analysis-depth: medium
    auto-comment: true
    auto-label: true
    exclude-labels: 'wontfix,duplicate,invalid'
    include-labels: 'bug,enhancement,question,documentation'
```

## 📋 Complete Configuration Reference

### Core Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `github-token` | string | `${{ github.token }}` | GitHub API token (required) |
| `workspace-path` | string | `${{ github.workspace }}` | Repository workspace path |

### LLM Provider Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `deepseek-token` | string | - | DeepSeek API token (recommended) |
| `openai-api-key` | string | - | OpenAI API key |
| `glm-token` | string | - | GLM API token |

*At least one LLM provider token is required.*

### Analysis Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `analysis-depth` | enum | `medium` | Analysis depth: `shallow`, `medium`, `deep` |
| `auto-comment` | boolean | `true` | Add analysis comments to issues |
| `auto-label` | boolean | `true` | Add labels based on analysis |

### Event Filtering

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger-events` | string | `opened,edited,reopened` | Comma-separated list of issue events |
| `exclude-labels` | string | - | Skip analysis for issues with these labels |
| `include-labels` | string | - | Only analyze issues with these labels |

### File Filtering (New!)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `include-config-files` | boolean | `true` | Include configuration files (jest.config.js, etc.) |
| `include-test-files` | boolean | `true` | Include test files (__tests__/, *.test.js, etc.) |
| `include-patterns` | string | - | File patterns to force include (comma-separated) |
| `exclude-patterns` | string | - | File patterns to exclude (comma-separated) |
| `force-include-files` | string | - | Specific files to always include |

## 🎯 Use Case Configurations

### For JavaScript/TypeScript Projects
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    include-config-files: true
    include-patterns: "*.config.js,*.config.ts,tsconfig.json,package.json"
    exclude-patterns: "*.min.js,*.bundle.js,node_modules/**"
```

### For Test-Heavy Projects
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    include-test-files: true
    force-include-files: "jest.config.js,vitest.config.ts,cypress.config.js"
    analysis-depth: deep
```

### For Documentation Projects
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    include-patterns: "*.md,docs/**,*.rst"
    include-labels: 'documentation,docs'
```

### High-Volume Repositories
```yaml
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    analysis-depth: shallow
    exclude-labels: 'wontfix,duplicate,invalid,question'
    exclude-patterns: "*.min.js,*.bundle.js,dist/**,build/**"
```

## 🔍 File Pattern Examples

### Include Patterns
```yaml
include-patterns: "*.config.js,*.config.ts,docker-compose.yml,Dockerfile"
```

### Exclude Patterns  
```yaml
exclude-patterns: "*.min.js,*.bundle.js,node_modules/**,dist/**,build/**"
```

### Force Include Files
```yaml
force-include-files: "jest.config.js,rollup.config.mjs,important-setup.ts"
```

## 🛠️ Troubleshooting Configurations

### Too Many Files Filtered
```yaml
# More inclusive configuration
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    include-config-files: true
    include-test-files: true
    analysis-depth: deep
    # Force include important files
    force-include-files: "jest.config.js,rollup.config.mjs,package.json"
```

### Analysis Too Slow
```yaml
# Faster configuration
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    analysis-depth: shallow
    exclude-patterns: "*.min.js,*.bundle.js,dist/**,node_modules/**"
```

### Only Specific Issue Types
```yaml
# Only analyze bugs and features
- uses: unit-mesh/autodev-remote-agent-action@v0.3.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deepseek-token: ${{ secrets.DEEPSEEK_TOKEN }}
    include-labels: 'bug,enhancement'
    exclude-labels: 'question,documentation'
```

## 📊 Understanding Analysis Output

The action provides detailed transparency information in comments:

- **Process Summary**: Files scanned, analyzed, and filtered counts
- **Filtered Files**: Specific files excluded with reasons
- **Analysis Steps**: Each step's success/failure and timing
- **LLM Calls**: AI service interactions and errors
- **Improvement Suggestions**: How to get better results

## 🔧 Environment Variables

You can also configure the action using environment variables:

```yaml
env:
  DEEPSEEK_TOKEN: ${{ secrets.DEEPSEEK_TOKEN }}
  ANALYSIS_DEPTH: medium
  AUTO_COMMENT: true
  AUTO_LABEL: true
  INCLUDE_CONFIG_FILES: true
  INCLUDE_TEST_FILES: true
```

## 🚨 Security Considerations

- Store API tokens in GitHub Secrets, never in code
- Use `GITHUB_TOKEN` for GitHub API access (automatically provided)
- Limit repository access if using personal access tokens
- Review file patterns to avoid exposing sensitive files

## 📈 Performance Tips

1. **Use appropriate analysis depth**: `shallow` for quick feedback, `deep` for complex issues
2. **Filter unnecessary files**: Exclude build artifacts and dependencies
3. **Use specific include patterns**: Target relevant file types
4. **Limit trigger events**: Only analyze on necessary events
5. **Use label filtering**: Skip analysis for certain issue types

For more details, see [TRANSPARENCY.md](TRANSPARENCY.md) for understanding analysis results.
